import HeaderComponent from '../Header/HeaderComponent';
import TextareaComponent from '../Textarea/TextareaComponent';
import './keyboardBody.scss';
import { keysObject } from './keys-config';

class KeyboardJs {
  constructor() {
    this.element = null;

    this.textarea = null;

    this.state = {
      isShiftLeftPressed: false,
      isShiftRightPressed: false,
      isCapsLockPressed: false,
      case: 'caseDown',
      lang: 'eng',
    };

    this.current = {
      element: null,
      code: null,
      event: null,
      char: null,
    };

    this.previous = {
      element: null,
      code: null,
      event: null,
      char: null,
    };
  }

  initKeyboard() {
    /* ---- ROOT START---- */
    const divRoot = document.createElement('div');
    divRoot.setAttribute('id', 'root');
    /* ---- ROOT END ---- */

    /* ---- HEADER  START---- */
    const header = HeaderComponent('header', 'h1', 'headerTitle');
    divRoot.appendChild(header);
    /* ---- HEADER END---- */

    /* ---- TEXTAREA  START---- */
    const output = TextareaComponent('div', 'textarea');
    this.textarea = output;
    divRoot.appendChild(output);
    /* ---- TEXTAREA  END---- */

    const keysSection = this.keyGenerator(keysObject.KEYS_CONFIG);

    divRoot.appendChild(keysSection);

    document.body.appendChild(divRoot);

    document.addEventListener('keyup', this.keyUpHandler.bind(this));
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.toggleCapsLock.bind(this));

    console.log('keyboard init');
  }

  keyGenerator(keys) {
    const keyboardBody = document.createElement('div');
    keyboardBody.classList.add('keyboardBody');
    this.element = keyboardBody;
    const fragment = document.createDocumentFragment();

    for (let k = 0; k < keys.length; k += 1) {
      const keyboardRow = document.createElement('div');
      keyboardRow.classList.add('keyboardRow');
      for (let j = 0; j < keys[k].length; j += 1) {
        const keyElement = document.createElement('div');
        keyElement.classList.add('keyboard--key', 'key', keys[k][j].className);

        const spanRus = document.createElement('span');
        spanRus.classList.add('rus', 'hidden');
        spanRus.insertAdjacentHTML('afterBegin', `<span class="caseDown hidden">${keys[k][j].rus.caseDown}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="caseUp hidden">${keys[k][j].rus.caseUp}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="caps hidden">${keys[k][j].rus.caps || keys[k][j].rus.caseUp}</span>`);
        spanRus.insertAdjacentHTML('beforeEnd', `<span class="shiftCaps hidden">${keys[k][j].rus.shiftCaps || keys[k][j].rus.caseDown}</span>`);
        keyElement.appendChild(spanRus);

        const spanEng = document.createElement('span');
        spanEng.classList.add('eng');
        spanEng.insertAdjacentHTML('afterBegin', `<span class="caseDown">${keys[k][j].eng.caseDown}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="caseUp hidden">${keys[k][j].eng.caseUp}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="caps hidden ">${keys[k][j].eng.caps || keys[k][j].eng.caseUp}</span>`);
        spanEng.insertAdjacentHTML('beforeEnd', `<span class="shiftCaps hidden">${keys[k][j].eng.shiftCaps || keys[k][j].eng.caseDown}</span>`);
        keyElement.appendChild(spanEng);

        if (keys[k][j].lv !== undefined) {
          const spanLv = document.createElement('span');
          spanLv.classList.add('lv', 'hidden');
          spanLv.insertAdjacentHTML('afterBegin', `<span class="caseDown hidden">${keys[k][j].lv.caseDown}</span>`);
          spanLv.insertAdjacentHTML('beforeEnd', `<span class="caseUp hidden">${keys[k][j].lv.caseUp}</span>`);
          spanLv.insertAdjacentHTML('beforeEnd', `<span class="caps hidden">${keys[k][j].lv.caps || keys[k][j].lv.caseUp}</span>`);
          spanLv.insertAdjacentHTML('beforeEnd', `<span class="shiftCaps hidden">${keys[k][j].lv.shiftCaps || keys[k][j].lv.caseDown}</span>`);
          keyElement.appendChild(spanLv);
        }
        switch (keys[k][j].className) {
          case 'CapsLock':
            keyElement.addEventListener('keyup', this.toggleCapsLock.bind(this));
            break;

            // no default
        }
        keyboardRow.appendChild(keyElement);
      }
      fragment.appendChild(keyboardRow);
    }
    keyboardBody.appendChild(fragment);
    return keyboardBody;
  }

  keyUpHandler(e) {
    const pressedButton = this.element.getElementsByClassName(e.code)[0];
    // if pressedButton is not empty then set the as current element
    if (pressedButton) {
      this.current.element = pressedButton.closest('div');
    }
    switch (e.code) {
      case 'ShiftLeft' || 'ShiftRight':
        if (this.state.isCapsLockPressed) {
        // make all letter caseUP
          this.state.isShiftLeftPressed = false;
          this.state.isShiftRightPressed = false;
          this.toggleKeysCase();
          this.btnUp();
        }
        break;
         // no default
    }
  }

  keyDownHandler(e) {
    e.preventDefault();
    this.current.event = e;
    this.current.code = e.code;
    [this.current.element] = this.element.getElementsByClassName(e.code);
    if (this.current.element) {
      this.current.char = this.current.element.querySelectorAll(':not(.hidden)')[1].textContent;
    }
    switch (e.code) {
      case 'ShiftLeft' || 'ShiftRight':
        if (this.state.isCapsLockPressed) {
        // make all letter caseDown
          this.state.isShiftLeftPressed = true;
          this.state.isShiftRightPressed = true;
          this.toggleKeysCase();
          this.btnDown();
        }
        break;
        // no default
    }
    if (!keysObject.FN_BTN.includes(e.code)) {
      const textareaValue = this.textarea.value;
      const selectionStartIndex = this.textarea.selectionStart;
      let slicedText = '';

      const insertedValue = e.key;

      if (selectionStartIndex >= 0 && selectionStartIndex <= textareaValue.length) {
        // slice text of the cursor position LEFT side
        slicedText += textareaValue.slice(0, selectionStartIndex);
        // add current pressed key at selected start cursor position
        slicedText += this.current.char;
        // slice text of the cursor position RIGHT side
        slicedText += textareaValue.slice(selectionStartIndex, textareaValue.length);
        // input combined text to text area
        this.textarea.value = slicedText;

        this.textarea.selectionStart = selectionStartIndex + this.current.char.length;
        this.textarea.selectionEnd = selectionStartIndex + this.current.char.length;
      } else {
        this.textarea.value += insertedValue;
      }
    }
  }

  toggleCapsLock(e) {
    if (e.code === 'CapsLock') {
      if (!this.state.isCapsLockPressed) {
        this.addActiveState();
        this.state.isCapsLockPressed = true;
        this.toggleKeysCase();
      } else {
        this.removeActiveState();
        this.state.isCapsLockPressed = false;
        this.toggleKeysCase();
      }
    }
  }

  addActiveState() {
    this.current.element.classList.add('active');
  }

  btnDown() {
    this.current.element.classList.add('pressed');
  }

  btnUp() {
    this.current.element.classList.remove('pressed');
  }

  removeActiveState() {
    this.current.element.classList.remove('active');
  }

  toggleKeysCase() {
    const e = this.element.querySelectorAll(`div>.${this.state.lang}`);
    for (let s = 0; s < e.length; s += 1) {
      e[s].querySelectorAll('span')[0].classList.contains('hidden') || e[s].querySelectorAll('span')[0].classList.add('hidden');
      e[s].querySelectorAll('span')[1].classList.contains('hidden') || e[s].querySelectorAll('span')[1].classList.add('hidden');
      e[s].querySelectorAll('span')[2].classList.contains('hidden') || e[s].querySelectorAll('span')[2].classList.add('hidden');
      e[s].querySelectorAll('span')[3].classList.contains('hidden') || e[s].querySelectorAll('span')[3].classList.add('hidden');
      (this.state.isShiftLeftPressed || this.state.isShiftRightPressed) && this.state.isCapsLockPressed ? (e[s].querySelectorAll('span')[3].classList.remove('hidden'),
      this.state.case = 'shiftCaps') : this.state.isCapsLockPressed ? (e[s].querySelectorAll('span')[2].classList.remove('hidden'),
      this.state.case = 'caps') : this.state.isShiftLeftPressed || this.state.isShiftRightPressed ? (e[s].querySelectorAll('span')[1].classList.remove('hidden'),
      this.state.case = 'caseUp') : (e[s].querySelectorAll('span')[0].classList.remove('hidden'),
      this.state.case = 'caseDown');
    }
  }
}

export default KeyboardJs;
