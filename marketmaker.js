var autradex = require("./autradex.js");

autradex.accessKey = "";
autradex.secretKey = "";
var loop = 30;
/*
autradex.allMarketsTicker(function(res){
	if(!res.error){
		console.log(res);
	}else{
		console.log(res);
	}
})
*/


//MARKET MAKER BOT TEST
setInterval(function() {
	console.log("_________________________________________________________");
		//test market maker bot\
	var theMarket = "dogebtc";
	var increase = 0.000000001;
	var volume = 100;

	//CLOSE ALL ORDERS
	//

	autradex.clearAllOrders(function(res){
		if(!res.error){
			console.log("Removing old orders...");
			res.forEach(function(order){
				console.log(order.id + "|" + order.state + "|" + order.side);
			});
			autradex.orderBook(theMarket, function(res){
				if(!res.error){
					//get spread
			
					var selling = parseFloat(res.asks[0].price);
					var buying = parseFloat(res.bids[0].price);
					console.log("[Market Making]");
					console.log("Selling At: " + selling.toFixed(9));
					console.log("Buying At: " + buying.toFixed(9));
					var spread = ((selling - increase) - (buying + increase)).toFixed(9);
					console.log("Spread: " + spread);
					if(spread < 0.00000003){
						//not worth it end
						console.log("Not worth it, spread is to low...");
						return;
					}
					//
					//check if those orders our ours, 
					var oursSell = false;
					var oursBuy = false;
					autradex.orders(theMarket, function(res){
						if(!res.error){
							//if not ours open orders + 1 and -1 each side of the market to try win spread
							//console.log(res);
							res.forEach(function(order){
								console.log(order.price);
								if(order.price == selling){
									oursSell = true;
								}
								if(order.price == buying){
									oursBuy = true;
								}
							});
			
							var buyPrice = (buying + increase).toFixed(9);
							var sellPrice = (selling - increase).toFixed(9);
			
							if(!oursBuy || !oursSell){
								console.log("Orders live are not ours, making new orders...");
								//buy
								console.log("Buy Price: " + buyPrice);
								console.log("Sell Price: " + sellPrice);
			
								autradex.createOrder(theMarket, "buy", volume, buyPrice, function(res){
									if(!res.error){
											//sell
											autradex.createOrder(theMarket, "sell", volume, sellPrice, function(res2){
												if(!res.error){
													console.log(res.id + "|" + res.state + "|" + res.side);
													console.log(res2.id + "|" + res2.state + "|" + res2.side);
													// 
												}else{
													console.log(res)
												}
											});
									}else{
										console.log(res)
									}
								});				
							}else{
								console.log("Orders live are ours...");
							}
			
						}else{
							console.log(res)
						}
					});
			
				}else{
					console.log(res)
				}
			});
					
		}else{
			console.log(res)
		}
	});

}, loop * 1000);