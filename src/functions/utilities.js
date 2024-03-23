export const debounce = (fn, time) => {
  let timeout;

  return function (...args) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn.apply(this, args);
      timeout = null;
    }, time);
  };
};
