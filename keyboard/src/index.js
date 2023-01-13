import './styles.scss';
import Header from './Header/index';
import Textarea from './Textarea/index';

const root = document.getElementById('root');
root.append(Header);
root.append(Textarea);

/*
class KeyboardButton {
  constructor(selector) { this.$el = document.querySelector(selector); }
}
*/
