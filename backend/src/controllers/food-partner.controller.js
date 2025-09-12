import { FoodPartner } from "../models/foodPartner.model.js";
import { Food } from "../models/food.model.js";

export const getFoodPartnerById = async(req,res) =>{
    try {


        const partnerId = req.params.id;
        const partner = await FoodPartner.findById(partnerId).select("-password");
    // Food model stores the partner reference in `foodPartner`.
    // Query using the correct field so items are returned.
    const foodItems = await Food.find({ foodPartner: partnerId })
       
        
        if(!partner){
            return res.status(404).json({
                message:"Food Partner not found"
            })
        }

        res.status(200).json({
            message:"food partner fetched successfully",
            partner:{
                ...partner.toObject(),
                foodItems: foodItems
            }
           
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal server error in getFoodPartnerById controller",
            error: error.message
        })
    }
}