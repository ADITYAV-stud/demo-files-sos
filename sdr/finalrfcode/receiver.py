import time
import json
import numpy as np
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


# ============================================================
# CONFIGURATION
# ============================================================

CENTER_FREQ = 434_000_000
SAMPLE_RATE = 1_000_000
BANDWIDTH = 125_000

SF = 7
M = 2 ** SF

SAMPLES_PER_SYMBOL = 1024

AES_KEY = bytes.fromhex(
    "00112233445566778899aabbccddeeff"
    "ffeeddccbbaa99887766554433221100"
)


# ============================================================
# CHIRP
# ============================================================

def generate_chirp(symbol):

    n = np.arange(
        SAMPLES_PER_SYMBOL
    )

    phase = (
        np.pi *
        n *
        n /
        SAMPLES_PER_SYMBOL
    )

    chirp = np.exp(
        1j * phase
    )

    shift = int(
        symbol *
        SAMPLES_PER_SYMBOL /
        M
    )

    return np.roll(
        chirp,
        shift
    )


# ============================================================
# CSS DEMODULATOR
# ============================================================

def demodulate(iq):

    # Generate all possible reference chirps
    reference_chirps = []

    for symbol in range(M):

        reference_chirps.append(
            generate_chirp(symbol)
        )

    symbols = []

    count = (
        len(iq) //
        SAMPLES_PER_SYMBOL
    )

    for i in range(count):

        start = (
            i *
            SAMPLES_PER_SYMBOL
        )

        end = (
            start +
            SAMPLES_PER_SYMBOL
        )

        received = iq[
            start:end
        ]

        best_symbol = 0
        best_score = -1

        # Compare received chirp
        # against every possible symbol
        for symbol in range(M):

            reference = reference_chirps[symbol]

            correlation = abs(
                np.vdot(
                    reference,
                    received
                )
            )

            if correlation > best_score:

                best_score = correlation
                best_symbol = symbol

        symbols.append(
            best_symbol
        )

    return symbols


# ============================================================
# SYMBOLS → BITS
# ============================================================

def symbols_to_bits(symbols):

    bits = []

    for symbol in symbols:

        for i in range(
            SF - 1,
            -1,
            -1
        ):

            bits.append(
                (symbol >> i) & 1
            )

    return bits


# ============================================================
# BITS → BYTES
# ============================================================

def bits_to_bytes(bits):

    output = bytearray()

    for i in range(
        0,
        len(bits),
        8
    ):

        value = 0

        for bit in bits[i:i + 8]:

            value = (
                value << 1
            ) | bit

        output.append(value)

    return bytes(output)


# ============================================================
# AES-GCM DECRYPTION
# ============================================================

def decrypt_packet(packet):

    nonce = packet[:12]

    ciphertext = packet[12:]

    aes = AESGCM(
        AES_KEY
    )

    plaintext = aes.decrypt(
        nonce,
        ciphertext,
        None
    )

    return json.loads(
        plaintext.decode()
    )


# ============================================================
# START RECEIVER
# ============================================================

print()
print("========================================")
print("             SOS RECEIVER")
print("========================================")
print()

print("[RF] Initializing receiver")

print(
    f"[RF] Frequency   : "
    f"{CENTER_FREQ / 1e6:.3f} MHz"
)

print(
    f"[RF] Sample Rate : "
    f"{SAMPLE_RATE / 1e6:.3f} MS/s"
)

print(
    f"[RF] Bandwidth   : "
    f"{BANDWIDTH / 1000:.0f} kHz"
)

print(
    f"[RF] Spreading Factor : SF{SF}"
)

print()

print(
    "[MODE] SOFTWARE IQ TEST MODE"
)

print()


# ============================================================
# LOAD TEST IQ
# ============================================================

iq = np.load(
    "sos_iq.npy"
)


# ============================================================
# SIGNAL SEARCH
# ============================================================

print(
    "[RF] Scanning for signal..."
)

for i in range(10):

    time.sleep(1)

    print(
        f"[RF] Scanning... "
        f"{i + 1}/10"
    )

print()

print(
    "[RF] Signal acquisition complete"
)

print(
    f"[RF] IQ samples acquired: "
    f"{len(iq)}"
)

print()


# ============================================================
# DEMODULATION
# ============================================================

print(
    "[DSP] Synchronizing chirp..."
)

time.sleep(0.5)

print(
    "[DSP] Dechirping IQ samples..."
)

time.sleep(0.5)

print(
    "[DSP] Performing FFT symbol detection..."
)

symbols = demodulate(
    iq
)

print(
    f"[DSP] Symbols recovered: "
    f"{len(symbols)}"
)

print()


# ============================================================
# SYMBOL → DATA
# ============================================================

print(
    "[DSP] Reconstructing encrypted payload..."
)

bits = symbols_to_bits(
    symbols
)

received_packet = bits_to_bytes(
    bits
)

print(
    "[DSP] Encrypted payload reconstructed"
)

print()


# ============================================================
# AES-GCM
# ============================================================

print(
    "[SECURITY] Authenticating packet..."
)

try:

    decoded = decrypt_packet(
        received_packet
    )

    print(
        "[SECURITY] AES-GCM authentication: PASS"
    )

except Exception:

    print(
        "[SECURITY] AES-GCM authentication: FAIL"
    )

    raise SystemExit


# ============================================================
# DISPLAY SOS
# ============================================================

print()

print("========================================")
print("             SOS MESSAGE")
print("========================================")

print(
    "Device ID      :",
    decoded["device_id"]
)

print(
    "Identification :",
    decoded["identification_id"]
)

print(
    "Priority       :",
    decoded["priority"]
)

print(
    "Latitude       :",
    decoded["latitude"]
)

print(
    "Longitude      :",
    decoded["longitude"]
)

print(
    "Battery        :",
    str(decoded["battery"]) + "%"
)

print(
    "Message        :",
    decoded["message"]
)

print()

print("========================================")
print("          PACKET DECODE SUCCESS")
print("========================================")
