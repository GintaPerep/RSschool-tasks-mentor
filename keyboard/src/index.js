import './styles.scss';
import Header from './Header/index';
import Textarea from './Textarea/index';
import Keyboard from './Keyboard/index';

const root = document.getElementById('root');
root.append(Header);
root.append(Textarea);
root.append(Keyboard);

/*
class KeyboardButton {
  constructor(selector) { this.$el = document.querySelector(selector); }
}
*/
