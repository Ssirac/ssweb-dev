// Drives a boomerang (ping-pong) loop on an HTMLVideoElement: plays forward
// natively, then scrubs `currentTime` backward by hand once it hits the end
// (HTMLVideoElement has no reliable cross-browser reverse playback), so the
// direction change reads as a seamless bounce instead of a hard loop cut.
export type PingPongDirection = { current: 1 | -1 };

const END_EPSILON = 0.05;

export function advancePingPong(
  video: HTMLVideoElement,
  delta: number,
  dir: PingPongDirection,
) {
  if (!video.duration || Number.isNaN(video.duration)) return;

  if (dir.current === 1) {
    if (video.currentTime >= video.duration - END_EPSILON) {
      dir.current = -1;
      video.pause();
    }
    return;
  }

  const next = video.currentTime - delta;
  if (next <= 0) {
    video.currentTime = 0;
    dir.current = 1;
    void video.play?.().catch(() => {});
  } else {
    video.currentTime = next;
  }
}
