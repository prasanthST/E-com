class APIHelper {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // Search
  search(){
    const keyword = this.queryStr.keyword ?{
        name:{
            $regex:this.queryStr.keyword,
            $options:"i"
        }
    }:{}

    this.query = this.query.find({...keyword})
    return this;
  }
  // Filter
  
  filter(){
    const queryStrCopy = {...this.queryStr}
    const removeFields = ["keyword" , "page", "limit" ]
    removeFields.forEach((key)=> delete queryStrCopy[key])
    this.query = this.query.find(queryStrCopy)
    return this
  }
  //pagination
  pagenation(productPerPage){
    const currentPage = Number(this.queryStr.page)
    const skip = productPerPage * (currentPage-1)
    this.query = this.query.limit(productPerPage).skip(skip)
    return this 
  }
}
export default APIHelper;
