/**
 * @template {new(...args: any) => Error} TError
 * @param {TError} constructor
 * @param {ConstructorParameters<TError>} args 
 * @returns {never}
 */
export function raise(constructor, ...args)
{
  throw new constructor(...args);
}