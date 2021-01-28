import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import configureStore from 'redux-mock-store'

import SignPage from '../../sign/SignPage';


let container = null;
let store = null;
const mockStore = configureStore();
const initialState = {};

beforeEach(() => {
    store = mockStore(initialState);
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders after swap tab", () => {
    act(() => {
      render(<SignPage store={store}/>, container);
    });

    expect(document.getElementById("sign_Sign_SignUpTab_div")).not.toBeNull()
    expect(document.getElementById("sign_SignPage_SignInTab_div")).toBeNull()

    const sign_in_tab = document.getElementById("sign_SignPage_SignTabs_TabSingIn")
    expect(sign_in_tab.innerHTML).toContain("SIGN IN");
    act(() => {
        sign_in_tab.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.getElementById("sign_InTab_div")).not.toBeNull()
    expect(document.getElementById("sign_SignPage_SignUpTab_div")).toBeNull()

    const sign_up_tab = document.getElementById("sign_SignPage_SignTabs_TabSingUp")
    expect(sign_up_tab.innerHTML).toContain("SIGN UP");
    act(() => {
        sign_up_tab.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.getElementById("sign_SignPage_SignUpTab_div")).not.toBeNull()
    expect(document.getElementById("sign_SignPanInTab_div")).toBeNull()

  });