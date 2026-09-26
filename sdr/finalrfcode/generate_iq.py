import json
import numpy as np
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


# ============================================================
# CONFIGURATION
# ============================================================

SF = 7
M = 2 ** SF

SAMPLES_PER_SYMBOL = 1024

AES_KEY = bytes.fromhex(
    "00112233445566778899aabbccddeeff"
    "ffeeddccbbaa99887766554433221100"
)


# ============================================================
# SOS DATA
# ============================================================

sos_data = {
    "device_id": "SOSBOX-001",
    "identification_id": "PERSON-042",
    "priority": "INJURED",
    "latitude": 13.082700,
    "longitude": 80.270700,
    "battery": 87,
    "message": "NEED_MEDICAL_ASSISTANCE"
}


# ============================================================
# AES-GCM
# ============================================================

def encrypt_data(data):

    plaintext = json.dumps(
        data,
        separators=(",", ":")
    ).encode()

    aes = AESGCM(AES_KEY)

    nonce = bytes.fromhex(
        "112233445566778899aabbcc"
    )

    encrypted = aes.encrypt(
        nonce,
        plaintext,
        None
    )

    return nonce + encrypted


# ============================================================
# BYTES → BITS
# ============================================================

def bytes_to_bits(data):

    bits = []

    for byte in data:

        for i in range(7, -1, -1):

            bits.append(
                (byte >> i) & 1
            )

    return bits


# ============================================================
# BITS → SYMBOLS
# ============================================================

def bits_to_symbols(bits):

    symbols = []

    for i in range(0, len(bits), SF):

        value = 0

        for bit in bits[i:i + SF]:

            value = (value << 1) | bit

        symbols.append(value)

    return symbols


# ============================================================
# CHIRP GENERATOR
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

    chirp = np.roll(
        chirp,
        shift
    )

    return chirp


# ============================================================
# MODULATOR
# ============================================================

def modulate(data):

    bits = bytes_to_bits(data)

    symbols = bits_to_symbols(bits)

    iq = []

    for symbol in symbols:

        chirp = generate_chirp(
            symbol
        )

        iq.extend(chirp)

    return np.array(
        iq,
        dtype=np.complex64
    )


# ============================================================
# MAIN
# ============================================================

print()
print("========================================")
print("        SOS IQ SIGNAL GENERATOR")
print("========================================")
print()

print("[TX] Preparing SOS payload")

encrypted_packet = encrypt_data(
    sos_data
)

print("[TX] AES-GCM encryption complete")

print(
    "[TX] Encrypted bytes:",
    len(encrypted_packet)
)

print(
    "[TX] Encrypted payload:"
)

print(
    encrypted_packet.hex()
)

print()

print("[TX] Performing CSS modulation")

iq = modulate(
    encrypted_packet
)

print(
    "[TX] IQ samples generated:",
    len(iq)
)

np.save(
    "sos_iq.npy",
    iq
)

print()

print("[TX] IQ waveform saved")
print("[TX] File: sos_iq.npy")

print()
print("Generation complete.")
