// Stripped down Functors (from Monads) for demonstration
export const Identity = x => ({
  map: f => Identity(f(x)),
  fold: f => f(x),
  join: () => x
});
Identity.of = x => Identity(x);
export const Right = x => ({
  x,
  map: f => Right(f(x)),
  chain: f => f(x),
  fold: (l, r) => r(x),
  inspect: "Right"
});
export const Left = x => ({
  x,
  map: f => Left(f(x)),
  chain: f => Left(x),
  fold: (l, r) => l(x),
  inspect: "Left"
});
export const Either = () => {};
Either.of = x => Right(x);

// Combinators
export const identity = x => x;
export const always = x => y => x;
export const substitution = f => g => x => f(x)(g(x));

// Standard helpers
export const assoc = (obj, key, val) => Object.assign({}, obj, { [key]: val });
// export const partialRight = (fn,...args1) => (...args2) => fn.apply(fn,args2.concat(args1))

// Utility function
export const objReduce = (obj, reducer, initial = {}) =>
  Object.entries(obj).reduce(
    (acc, [key, val]) => reducer(acc, val, key, obj),
    initial
  );

// for debugging
export const trace = substitution(always)(console.log);
