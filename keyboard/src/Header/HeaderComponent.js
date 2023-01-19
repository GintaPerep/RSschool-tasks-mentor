import './header.scss';

const HeaderComponent = (parentName, childName, className) => {
  const element = document.createElement(parentName);
  const child = document.createElement(childName);
  child.classList.add(className);
  child.innerHTML = 'RSS Virtual Keyboard Javascript generated';
  element.appendChild(child);
  return element;
};

export default HeaderComponent;
