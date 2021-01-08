import { isProperty } from "./utils";
import { createDomNode, createElement } from "./createDomNode";

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;

function render(element, container) {
  // Set next unit of work
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
}

function commitRoot() {
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  // Element has not been created, do it
  if (!fiber.dom) {
    fiber.dom = createDomNode(fiber);
  }

  // If the element has a parent, append it to it's parent
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // Then create a new fiber for each child of the element
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // Find the next unit of work
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  // Check through all the parents and siblings in order to find either an uncle
  // or end up at the root node, which would mean we are done rendering
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < element.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: odlFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !sameType) {
      // Add this node
    }

    if (oldFiber && !sameType) {
      // delete the oldFiber's node
    }

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

export const Freeact = {
  createElement,
  render,
};
