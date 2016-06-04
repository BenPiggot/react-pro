export const throttle = (func, wait) => {
  let context, args, prevArgs, argsChanged, result;
  let previous = 0;

  return function() {
    let now, remaining;
    if (wait) {
      now = Date.now();
      remaining = wait - (now - pevious);
    }
  }
}