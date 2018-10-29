var h_canvas = 600;
var w_canvas = 600;

context = document.querySelector('canvas').getContext('2d');
context.canvas.height = h_canvas;
context.canvas.width = w_canvas;

var xy_canvas = context.canvas.getBoundingClientRect();
var x_canvas = xy_canvas.left;
var y_canvas = xy_canvas.top;

window.addEventListener("mousedown", GetButton);

var page_to_display;
var update_ratio = 60;

//Game Variables

var organic_matter = 0;
var price_grow_ratio = 0.1; //A fraction. The bigger it is the faster the price increases

class Producer {

    constructor(name, price, production) {
        this.name = name;
        this.base_price = price; //Constant
        this.price = price;
        this.production = production;
        this.amount = 0;
    }

    CalcPrice() {
        this.price = parseInt(Math.pow(this.base_price, 1 + this.amount * price_grow_ratio));
    }

    BuyProducer() {
        console.log("exectuting");
        console.log(this.price);
        console.log(organic_matter);
        if (organic_matter >= this.price) {
            organic_matter -= this.price;
            this.amount++;
            this.CalcPrice();
        }
    }

    SpawnMatter() {
        organic_matter += this.production * this.amount;
    }
}

var life_forms = [];
life_forms.push(new Producer("Cell", 20, 0.3/update_ratio));
life_forms.push(new Producer("Tissue", 50, 5/update_ratio));
life_forms.push(new Producer("Organ", 500, 20/update_ratio));
life_forms.push(new Producer("Organ System", 4000, 100/update_ratio));
life_forms.push(new Producer("Body", 20000, 600/update_ratio));
life_forms.push(new Producer("Community", 120000, 4200/update_ratio));
life_forms.push(new Producer("Environment", 500000, 15000/update_ratio));
life_forms.push(new Producer("Coutry Area", 1000000, 60000/update_ratio));
life_forms.push(new Producer("Continent", 5000000, 100000/update_ratio));
life_forms.push(new Producer("Planet", 10000000, 300000/update_ratio));

function OrganicMatterUpdate() {

    for (var life_form of life_forms) {
        life_form.SpawnMatter();
    
    }
    context.fillStyle = '#ffffff';
    context.font = '25px Arial';
    context.fillText("Organic Matter " + parseInt(organic_matter), 320, 40);
    context.font = '12px Arial';

    let h_stats = 70
    for(var life_form of life_forms){
        if(organic_matter >= life_form.price || life_form.amount > 0){
        context.fillText(life_form.name + '- Amount: ' + life_form.amount + ' Price: ' + life_form.price, 320, h_stats);
        h_stats +=15;
        }
        else{
            context.fillText(life_form.name + '- Amount: ' + life_form.amount + ' Price: ' + life_form.price, 320, h_stats);
            h_stats +=15;
            break;
        }
    }
}


//Menus classes
class Utility {

    constructor(name, utility_function) {
        this.name = name;
        this.function = utility_function;
    }
}

class Button {

    constructor(utility, x, y, to_display = true, font = "25px Arial", margin = 3, color = '#ffffff', background_color = '#32373f') {
        this.name = utility.name;
        this.function = utility.function;
        this.to_display = to_display;
        this.x = x;
        this.y = y;
        this.font = font;
        this.max_height = Number(font.slice(0, 2)); //Gets the height of the text according to the font
        this.max_width = 0; //Is calculated according to the text
        this.margin = margin; //Margin of the button
        this.color = color;
        this.background_color = background_color;
    }

    DrawButton() {

        context.font = this.font;
        this.max_width = context.measureText(this.name).width;

        //Draw Background
        context.fillStyle = this.background_color;
        context.fillRect(this.x, this.y, this.max_width + 2 * this.margin, this.max_height + 2 * this.margin);

        //Draw Text
        context.fillStyle = this.color;
        context.font = this.font;
        context.fillText(this.name, this.x + this.margin, this.y + this.max_height + this.margin - 2, this.max_width);
    }

    IsClicked(x, y) {
        if (x >= this.x && x <= this.x + this.max_width + 2 * this.margin && y >= this.y && y <= this.y + this.max_height + 2 * this.margin) {
            this.function();
            return true;
        }
    }

    HideButton() {
        this.to_display = false;
    }

    ShowButton() {
        this.to_display = true;
    }

}

class Menu {

    constructor(utilities, x, y, to_display = true, max_height = 0, max_width = 0, margin_horizontal = 10, margin_vertical = 2, margin_between = 2, menu_background_color = '#6d7787', button_background_color = '#32373f', button_color = '#ffffff', font = '25px Arial') {

        this.utilities = utilities;
        this.buttons = []; //The buttons will be created and added to this
        this.to_display = to_display;
        this.x = x;
        this.y = y;
        this.font = font;
        this.to_display = to_display;
        this.max_height = max_height;
        this.max_width = max_width;

        this.margin_horizontal = margin_horizontal; //Between the left and right
        this.margin_vertical = margin_vertical; //Between the top and bottom
        this.margin_between = margin_between; //Between each button
        this.menu_background_color = menu_background_color;

        this.button_margin = 3;
        this.button_max_height = Number(font.slice(0, 2)); //Gets the height of the button text according to the font
        this.button_background_color = button_background_color;
        this.button_color = button_color;

        this.GetSize();
        this.CreateButtons();

    }

    GetSize() {

        //Width
        if (this.max_width === 0) { //If the user has not given an width
            for (var utility of this.utilities) {


                context.font = this.font
                let text_width = context.measureText(utility.name).width;
                if (text_width > this.max_width) this.max_width = text_width + 2 * this.button_margin;
            }
            this.max_width += 2 * this.margin_horizontal;
        }

        //Height
        if (this.max_height === 0) { //If the user has not given an height
            this.max_height += this.utilities.length * ((this.button_max_height + 2 * this.button_margin) + this.margin_between); //The height of each button
            this.max_height -= this.margin_between; //There is one less gap than there are buttons
            this.max_height += 2 * this.margin_vertical; //The top and bottom margins
        }
    }

    CreateButtons() {

        context.font = this.font;

        for (var i = 0; i < this.utilities.length; i++) {
            let text_width = context.measureText(this.utilities[i].name).width;
            let x = this.x + this.margin_horizontal + ((this.max_width - 2 * this.margin_horizontal - text_width) / 2); //Gets the left x for the button
            let y = this.y + this.margin_vertical + i * (this.margin_between + this.button_max_height + 2 * this.button_margin); //Gets the top y for the button
            var new_button = new Button(this.utilities[i], x, y, this.to_display, this.font, this.button_margin, this.button_color, this.button_background_color);
            this.buttons.push(new_button);
        }
    }

    DrawMenu() {
        if (this.to_display) {
            //Draw Background
            context.fillStyle = this.menu_background_color;
            context.fillRect(this.x, this.y, this.max_width, this.max_height);

            for (var button of this.buttons) {
                button.DrawButton();
            }
        }
    }

    HideMenu() {
        this.to_display = false;

        for (var button of this.buttons) {
            button.to_display = false;
        }
    }

    ShowMenu() {
        this.to_display = true;

        for (var button of this.buttons) {
            button.to_display = true;
        }
    }

}

class Page {

    constructor(page_menus, page_buttons, background_color = '#ffffff', loop_function = '', loop_timing = 1000) {
        this.menus = page_menus;
        this.buttons = page_buttons;
        this.background_color = background_color;
        this.loop_function = loop_function; //The function to be performed when the page is recalculated
        this.loop_timing = loop_timing; //Recalculates the page every loop_timing seconds

        //There will be an error if there is no loop_function
    }

    DrawPage() {

        //Background
        context.fillStyle = this.background_color;
        context.fillRect(0, 0, w_canvas, h_canvas);

        //Menus
        if (this.menus) {
            if (this.menus.length > 1) {
                Object.entries(this.menus).forEach(([key, menu]) => {
                    menu.DrawMenu();
                });
            }
            else {
                this.menus.DrawMenu();
            }
        }

        //Buttons
        if (this.buttons) {
            if (this.buttons.length > 1) {
                Object.entries(this.buttons).forEach(([key, button]) => {
                    button.DrawButton();
                });
            }

            else {
                this.buttons.DrawButton();
            }
        }


        //Loop function
        this.loop_function();
        setTimeout(function () {
            window.requestAnimationFrame(DrawPage);
        }, this.loop_timing)

    }

    ShowPage() {

        page_to_display.HidePage(); //Hides the previous page

        page_to_display = this; //The new page to be displayed is the one that was called in the function

        if (this.menus) {
            if (this.menus.length > 1) {
                Object.entries(this.menus).forEach(([key, menu]) => {
                    menu.ShowMenu();
                });
            }
            else {
                this.menus.ShowMenu();
            }
        }

        if (this.buttons) {
            if (this.buttons.length > 1) {
                Object.entries(this.buttons).forEach(([key, button]) => {
                    button.ShowButton();
                });
            }
            else {
                this.buttons.ShowButton();
            }
        }

        window.requestAnimationFrame(DrawPage);
    }

    HidePage() {

        if (this.menus) {
            if (this.menus.length > 1) {
                Object.entries(this.menus).forEach(([key, menu]) => {
                    menu.HideMenu();
                });
            }
            else {
                this.menus.HideMenu();
            }
        }

        if (this.buttons) {
            if (this.buttons.length > 1) {
                Object.entries(this.buttons).forEach(([key, button]) => {
                    button.HideButton();
                });
            }
            else {
                this.buttons.HideButton();
            }
        }

    }

    GetButton(event) {
        let x = event.pageX - x_canvas;
        let y = event.pageY - y_canvas;
        var is_clicked = false;

        if (this.buttons) {
            if (this.buttons.length > 1) {
                Object.entries(this.buttons).forEach(([key, button]) => {
                    if (button.to_display) {
                        is_clicked = button.IsClicked(x, y) || is_clicked;
                    }
                });
            }
            else {
                var button = this.buttons;
                if (button.to_display) {
                    is_clicked = button.IsClicked(x, y) || is_clicked;
                }
            }
        }


        if (this.menus) {
            if (this.menus.length > 1) {
                Object.entries(this.menus).forEach(([key, menu]) => {
                    if (menu.to_display) {
                        if (menu.buttons) {
                            if (menu.buttons.length > 1) {
                                Object.entries(menu.buttons).forEach(([key, button]) => {
                                    if (button.to_display) {
                                        is_clicked = button.IsClicked(x, y) || is_clicked;
                                    }
                                });
                            }

                            else {
                                var button = menu.buttons;
                                if (button.to_display) {
                                    is_clicked = button.IsClicked(x, y) || is_clicked;
                                }
                            }
                        }
                    }
                });
            }
            else {
                let menu = this.menus;
                if (menu.to_display) {
                    if (menu.buttons) {
                        if (menu.buttons.length > 1) {
                            Object.entries(menu.buttons).forEach(([key, button]) => {
                                if (button.to_display) {
                                    is_clicked = button.IsClicked(x, y) || is_clicked;
                                }
                            });
                        }

                        else {
                            if (button.to_display) {
                                is_clicked = button.IsClicked(x, y) || is_clicked;
                            }
                        }
                    }
                }
            }
        }

    }

}

//Create pages here
var page_main;
var page_options;
var page_play;
var utilities = [];

function SpawnOrganicMatter() {
    organic_matter++;
}
utilities.push(new Utility("Spawn organic matter", SpawnOrganicMatter));
for (var producer of life_forms) {
    utilities.push(new Utility("Spawn " + producer.name, producer.BuyProducer.bind(producer))); //Is not working! Cannot call the function of the object
}

var page_play_menu = new Menu(utilities, 0, 0, 1, h_canvas, 300, 20, 10, 5, '#bf65b1', '#65bf74', '#ffffff');
page_play = new Page(page_play_menu, null, 'green', OrganicMatterUpdate, 1000/update_ratio);


//The html will initially display the page_main
page_to_display = page_play;
window.requestAnimationFrame(DrawPage);

//Mouseclick event function
function GetButton(event) {
    page_to_display.GetButton(event);
}

//Draw Page function for window.requestAnimationFrame();
function DrawPage() {
    page_to_display.DrawPage();
}

//For Internet Explorer Compatibility
if (!Object.entries) {
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}
