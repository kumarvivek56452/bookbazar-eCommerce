const User=require("../models/user")
const braintree=require("braintree")
require('dotenv').config()

// BRAINTREE_MERCENT_ID=rzwz4d5mvmcpmsy3
// BRAINTREE_PUBLIC_KEY=yhjcmynxv5pygw8q	
// BRAINTREE_PRIVATE_KEY=44842cc29888bad925250db7c720486

const gateway=new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCENT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:process.env.BRAINTREE_PRIVATE_KEY,

})

exports.generateToken=(req, res)=>{
    gateway.clientToken.generate({}, function(err, response){
        if(err){
            res.status(500).send(err)
        } else {
            res.send(response)
        }
    })
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;

    // Charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
