const product = require("../model/productSchema");



///////////add a product ///////////
const addProduct = async(req,res)=>{
      const addProduct = new product(req.body)
      const addedProduct = await addProduct.save();
  }

  //////////getProductByID//////////
  const getProductByID = async(req,res)=>{
        const id =req.params.id;
        const ID = await product.findById(id);
        res.json(ID)
  }  


  
  //////////getProductByCategory////////
  const getProductByCategory = async(req,res)=>{
        const Category = req.params.category;
        const CATEGORY = await product.find({category:Category  })
        if(CATEGORY.length>0)
        {
            res.json(CATEGORY)
        }  
            res.send("no category found")
  }

  ////////////updateProduct////////////
  const upadateProduct = async(req,res)=>{
    const productID = req.params.id;
    const updatedProduct = req.body;
        const UPDATEDPRODUCT = await product.findByIdAndUpdate(productID, updatedProduct, { new : true})

        if(UPDATEDPRODUCT){
            res.status(200).json({message :"product updated succesfully"})
        }
            res.status(404).json({message :"product not found"})
  }

  ////////////////deleteProduct//////////
  const deleteProduct = async(req,res)=>{
        const id = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(id);

        if(product){
            res.status(200).json({message :"item deleted succesfully"})
        }
            res.status(404).json({message:"product not found"})
  }

module.exports = { addProduct , getProductByID ,getProductByCategory ,
                     upadateProduct , deleteProduct
                    }