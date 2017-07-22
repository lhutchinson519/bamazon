var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "$",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        // run the start function after the connection is made to prompt the user
        start();
    });
});

function start() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units would you like?"
            }
        ]).then(function(answer) {
            console.log("Chosen Product ID: " + answer.id);
            console.log("Chosen Units Desired: " + answer.units);
            // get the information of the chosen product
            var chosenProduct;
            for (var i = 0; i < results.length; i++) {
                // console.log(results[i].id);
                if (results[i].id == answer.id) {

                    chosenProduct = results[i];
                    console.log("Chosen Product Stock Availible: " + JSON.stringify(chosenProduct.stock_quantity));
                }
            }
            	// console.log(typeof answer.units);
            	// console.log(JSON.stringify(chosenProduct.stock_quantity));

            if (parseInt(answer.units) < JSON.stringify(chosenProduct.stock_quantity)) {

                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: JSON.stringify(chosenProduct.stock_quantity) - answer.units
                        },
                        {
                            id: answer.id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        //Once the update goes through, show the customer the total cost of their purchase.
                        console.log("Total Product Cost: $" + JSON.stringify(chosenProduct.price));
                        // start();
                    }
                );
            } else {
                // We're out of stock! Maybe luck next time!
                console.log("We're out of stock! Maybe luck next time...");
                start();
            }

        })
    });
}