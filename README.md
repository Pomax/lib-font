A handy `man` function:

```
(function(scope) {
  scope.man = function man(argv) {
    const term = argv[0];
    let data = scope[term].manPage;
    if (data) {
      if (typeof data === "string") console.log(data);
      else data.forEach(section => console.log(section.text, section.style));
    }
  };
})(window);
```