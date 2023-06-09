const product = require("../model/productSchema");


/////////////////////  add  category  /////////////////
// const addCategory = async (req,res)=>{
//     try{
//        const  categoryName = req.body.name;
//        if(!categoryName || categoryName.trim().length<2){
//         res.json({message : "enter valid category name"})
//        }
//        const existingCategory = await category.findOne({ name : categoryName});

//        if(existingCategory){
//         res.json({message :"category already exists"})
//        }
//        const Category = new category(categoryName);
//        const categoryData = await Category.save();

//        if(categoryData){
//            res.status(200).json({message :"category saved succefully"})
//        }
//     }
//     catch (error){
//         res.status(500).json(error)
//     }
// }

///////////add a product ///////////
const addProduct = async(req,res)=>{
    try{
      const addProduct = new product(req.body)
      const addedProduct = await addProduct.save();
      res.json(addedProduct)
    }
    catch(error){
        res.json(error)
    }
  }

  //////////getProductByID//////////
  const getProductByID = async(req,res)=>{
    try{
        const id =req.params.id;
        const ID = await product.findById(id);
        res.json(ID)
        // console.log("worked")
    }
    catch(error){
        res.json(error);
        // console.log("not")
    }
  }  

  //////////getProductByCategory////////
  const getProductByCategory = async(req,res)=>{
    try{
        const Category = req.params.category;
        // console.log(Category)
        const CATEGORY = await product.find({category:Category  })
        if(CATEGORY.length>0)
        {
            res.json(CATEGORY)
        }
        else{
            res.send("no category found")
        }
    }
    catch(error){
        res.json(error);
        // console.log("seconf")
    }
  }

  ////////////updateProduct////////////
  const upadateProduct = async(req,res)=>{
    const productID = req.params.id;
    const updatedProduct = req.body;
    try{
        const UPDATEDPRODUCT = await product.findByIdAndUpdate(productID, updatedProduct, { new : true})

        if(UPDATEDPRODUCT){
            res.status(200).json({message :"product updated succesfully"})
        }else{
            res.status(404).json({message :"product not found"})
        }
    }catch(error){
        res.status(500).json(error)
    }
  }

  ////////////////deleteProduct//////////
  const deleteProduct = async(req,res)=>{
    try{
        const id = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(id);

        if(product){
            res.status(200).json({message :"item deleted succesfully"})
        }else{
            res.status(404).json({message:"product not found"})
        }
    }catch(error){
        res.status(500).json(error)
    }
  }

module.exports = { addProduct , getProductByID ,getProductByCategory ,
                     upadateProduct , deleteProduct
                    }