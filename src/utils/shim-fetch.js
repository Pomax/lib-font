/**
 * A shim for the Fetch API. If not defined, we assume we're running
 * in Node.js and shim the fetch function using the `fs` module.
 */

let fetch = globalThis.fetch;

if (!fetch) {
  let backlog = [];

  fetch = globalThis.fetch = (...args) => {
    return new Promise((resolve, reject) => {
      backlog.push({ args, resolve, reject });
    });
  };

  import("fs")
    .then((fs) => {
      fetch = globalThis.fetch = async function (path) {
        return new Promise((resolve, reject) => {
          fs.readFile(path, (err, data) => {
            if (err) return reject(err);
            resolve({
              ok: true,
              arrayBuffer: () => data.buffer,
            });
          });
        });
      };

      while (backlog.length) {
        let instruction = backlog.shift();
        fetch(...instruction.args)
          .then((data) => instruction.resolve(data))
          .catch((err) => instruction.reject(err));
      }
    })
    .catch((err) => {
      console.error(err);
      throw new Error(
        `Font.js cannot run unless either the Fetch API or Node's filesystem module is available.`
      );
    });
}

export default "shim activated";
