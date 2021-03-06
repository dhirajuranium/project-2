const collegeModel = require('../models/collageModel')
const internModel = require('../models/internModel')



const createCollege = async function (req, res) {
try{
    let { name, fullName, logoLink } = req.body

    if (Object.keys(req.body).length == 0) {
          return res.status(400).send({status:false,msg:"please enter a data in request body"})
    }
    if (!name){
        return res.status(400).send({status:false,msg:"Name is missing"})
    }

    let uniqueName = await collegeModel.findOne({ name: name })
    if (uniqueName) {
        return res.status(400).send({ status: false, msg: "This name already exists" })
    }
    if (typeof req.body.name !== "string")return res.status(400).send({ status: false, msg: " Please enter  name as a String" });

    let validname = /^\w[a-zA-Z.]*$/;
    if (!validname.test(req.body.name))return res.status(400).send({ status: false, msg: "The  name may contain only letters" });


    if (!fullName){
        return res.status(400).send({status:false,msg:"fullName is missing"})
    }
    if (typeof req.body.fullName !== "string")return res.status(400).send({ status: false, msg: " Please enter  fullName as a String" });

    let validfullName = /^\w[a-zA-Z.\s]*$/;
    if (!validfullName.test(req.body.fullName))return res.status(400).send({ status: false, msg: "The  fullName may contain only letters" });

   
    if (!logoLink){
        return res.status(400).send({status:false,msg:"please enter logo link"})
    }
    let validlogoLink = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if (!validlogoLink.test(req.body.logoLink))return res.status(400).send({ status: false, msg: "Please enter valid link" });

    if (typeof req.body.logoLink !== "string")return res.status(400).send({ status: false, msg: " Please enter  logoLink as a String" });

    let saveData=await collegeModel.create(req.body)
           return res.status(201).send({status:true,data:saveData,msg:"College is created Successfully"})
}catch(err){
    return res.status(500).send({status:false,msg:err.message})
}
}



const getCollegeDetail = async function (req,res) {

    try {
        let query = req.query;
        if(Object.keys(query).length === 0) return res.status(400).send({status:false,msg:"pls Enter Query"})

        if(!(["collegeName"].some(value => Object.keys(query).includes(value)))) return res.status(400).send({status:false,msg:`You cant find this Query`})

        let collegeDetail = await collegeModel.findOne({name:query.collegeName});

        if(!collegeDetail)  return res.status(404).send({status:false,msg:`${query.collegeName} is not present .`})

        let intern = await internModel.find({collegeId:collegeDetail._id,isDeleted:false}).select({name:1,email:1,mobile:1});

        if(intern.length === 0)  return res.status(404).send({status:false,msg:"intern is not found ."})

        let {name,fullName,logoLink} = collegeDetail

        return res.status(200).send({status:true, data:{name,fullName,logoLink,intern},msg: "here all intern are, related to your search"})
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.message})
    }

}






module.exports.createCollege=createCollege;
module.exports.getCollegeDetail=getCollegeDetail;