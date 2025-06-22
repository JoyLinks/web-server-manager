const K = 1024;
const M = K * 1024;
const G = M * 1024;
const T = G * 1024;

export default function bytesText(bytes) {
	if (bytes < K) {
		return bytes + " byte";
	}
	if (bytes < M) {
		return (bytes / K).toFixed(2) + " Kb";
	}
	if (bytes < G) {
		return (bytes / M).toFixed(2) + " Mb";
	}
	if (bytes < T) {
		return (bytes / G).toFixed(2) + " Gb";
	}
	return (bytes / T).toFixed(2) + " Tb";
}