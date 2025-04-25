import { model, Schema } from "mongoose";


const ConservationSchema = new Schema({
members:{
    type:Array
},
  timestamp: {
    type: Date,
    default: Date.now,
  }

});

export   const ConservationModel=model("conservation", ConservationSchema);



