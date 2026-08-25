export function downsampleBuffer(
    buffer,
    inputSampleRate,
    outputSampleRate
) {
    if (
        outputSampleRate ===
        inputSampleRate
    ) {
        return buffer;
    }

    const ratio =
        inputSampleRate /
        outputSampleRate;

    const newLength = Math.round(
        buffer.length / ratio
    );

    const result =
        new Float32Array(newLength);

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (
        offsetResult < result.length
    ) {
        const nextOffsetBuffer =
            Math.round(
                (offsetResult + 1) *
                    ratio
            );

        let accum = 0;
        let count = 0;

        for (
            let i = offsetBuffer;
            i < nextOffsetBuffer &&
            i < buffer.length;
            i++
        ) {
            accum += buffer[i];
            count++;
        }

        result[offsetResult] =
            count > 0
                ? accum / count
                : 0;

        offsetResult++;
        offsetBuffer =
            nextOffsetBuffer;
    }

    return result;
}

export function floatTo16BitPCM(
    input
) {
    const output =
        new Int16Array(input.length);

    for (
        let i = 0;
        i < input.length;
        i++
    ) {
        const sample = Math.max(
            -1,
            Math.min(1, input[i])
        );

        output[i] =
            sample < 0
                ? sample * 0x8000
                : sample * 0x7fff;
    }

    return output;
}

export function int16ToBase64(
    pcm
) {
    const bytes =
        new Uint8Array(
            pcm.buffer
        );

    let binary = "";

    const chunkSize = 0x8000;

    for (
        let i = 0;
        i < bytes.length;
        i += chunkSize
    ) {
        const chunk =
            bytes.subarray(
                i,
                Math.min(
                    i + chunkSize,
                    bytes.length
                )
            );

        binary += String.fromCharCode(
            ...chunk
        );
    }

    return btoa(binary);
}

export function base64ToInt16(
    base64
) {
    const binary =
        atob(base64);

    const bytes =
        new Uint8Array(
            binary.length
        );

    for (
        let i = 0;
        i < binary.length;
        i++
    ) {
        bytes[i] =
            binary.charCodeAt(i);
    }

    return new Int16Array(
        bytes.buffer
    );
}