import ComponentFactory from "./ComponentFactory.js";
import Icons from "./utils/Icons.js";

class Main {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add("has-js");

    new ComponentFactory();

    Icons.load();
  }
}
new Main();
