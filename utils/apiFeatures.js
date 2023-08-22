class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeEle = ['page', 'sort', 'fields', 'limit'];
    excludeEle.forEach((el) => delete queryObj[el]);
    // Advance Filtering
    // { duration: { gte: '5' }, difficulty: 'easy' }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortStr);
      // sort('price ratingAverage')
    } else {
      // Default
      this.query = this.query.sort('createdAt');
    }
    return this;
  }

  limitFilelds() {
    if (this.queryString.fields) {
      const fieldStr = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
