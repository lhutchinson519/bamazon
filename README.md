# bamazon

bamazonCustomer.js:

Inquirer and mysql packages were installed into the project directory in order to run this Amazon-like storefront.

The app takes in orders from customers and depletes stock from the store's inventory.

The user is asked in an inquirer prompt to select the ID of a product they would like to purchase, in addition to how many units they desire.

Given that the requested amount is available, by using a connection query, the server responds with the amount of product available along with the price of the item. However, if the amount is too high than the amount in stock, the user is prompted to start over.


bamazonManager.js:

This is a separate node application that prompts the manager to answer 1 of 4 questions...

If a manager selects View Products for Sale, the app will list every available item: the item IDs, names, prices, and quantities.

If a manager selects View Low Inventory, then it will list all items with an inventory count lower than five.

If a manager selects Add to Inventory, the app will display a prompt that will let the manager "add more" of any item currently in the store.

If a manager selects Add New Product, it will allow the manager to add a completely new product to the store.