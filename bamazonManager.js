var mysql = require("mysql");
var inquirer = require("inquirer");
//creates the connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "$",
    database: "bamazon_db"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id: " + connection.threadId);

    // connection.query("SELECT * FROM products", function(err, res) {
    //     if (err) throw err;
    //     console.log(res);

    start();
})

//when the page loads, a prompt is called. Depending on the selected answer, a new function is called.
function start() {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer.prompt([{
            name: "manage",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }]).then(function(answer) {

            switch (answer.manage) {
                case "View Products for Sale":
                    productSale();
                    start();
                    break;

                case "View Low Inventory":
                    lowInventory();
                    start();
                    break;

                case "Add to Inventory":
                    addInventory();
                    // start();
                    break;

                case "Add New Product":
                    newProduct();
                    // start();
                    break;
            }

        })
    })
}
//function to display all products
function productSale() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
    });
}
//function to display inventory that have less than 5 in stock
function lowInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("Checking for low inventory...");
        if (err) throw err;

        var lowInventoryitems;
        var lowInventoryStock;
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {

                lowInventoryitems = res[i].product_name;
                lowInventoryStock = res[i].stock_quantity;

                console.log("Inventory Item: " + lowInventoryitems + "\nInventory Count: " + lowInventoryStock);
            }
        }
    });
}
//function to add quantity to a specific item in inventory
function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        inquirer.prompt([{
                name: "choice",
                type: "rawlist",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which item needs more inventory?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How much are you adding?"
            }
        ]).then(function(answer) {

            var setQuantity;
            var newQuantity;
            for (var i = 0; i < res.length; i++) {
                // console.log(res[i].stock_quantity);
                if (res[i].product_name == answer.choice) {
                    setQuantity = res[i];
                    console.log("Changing stock Item: " + JSON.stringify(setQuantity));
                    // console.log(answer.quantity)
                    newQuantity = parseInt(answer.quantity)
                    newQuantity += setQuantity.stock_quantity;
                    console.log(typeof answer.quantity + " New value: " + newQuantity);
                    // console.log(setQuantity.stock_quantity);
                }
            }
            connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: answer.quantity
                    },
                    {
                        product_name: answer.choice
                    }
                ],
                function(error) {
                    if (error) throw err;

                    console.log("New Item Stock Updated!");
                })
        })
    });
};

//function to add a new product using an inquirer prompt message
function newProduct() {

    inquirer
        .prompt([{
                name: "product",
                type: "input",
                message: "What is the product you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department would you like to place the product in?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the cost of the product?"
            },
            {
                name: "quantity",
                type: "input",
                message: "How much would you like to add of the product?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
    //then the product is insert into the databse through a connection query.
        .then(function(answer) {
        	console.log("Adding your product...");

            connection.query(
                "INSERT INTO products SET ?", {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            )
        });
}
