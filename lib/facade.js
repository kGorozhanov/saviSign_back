class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  create(input) {
    let  schema;
    if(Array.isArray(input)) {
      schema = input.map((item) => new this.Schema(item));
    } else {
      schema = new this.Schema(input);
    }
    return schema.save();
  }

  update(conditions, update) {
    return this.Schema
    .update(conditions, update, { new: true })
    .exec();
  }

  find(query) {
    return this.Schema
    .find(query)
    .exec();
  }

  findOne(query) {
    return this.Schema
    .findOne(query)
    .exec();
  }

  findById(id) {
    return this.Schema
    .findById(id)
    .exec();
  }

  remove(id) {
    return this.Schema
    .findByIdAndRemove(id)
    .exec();
  }

  populate(collection, params) {
    return this.Schema.populate(collection, params);
  }
}

module.exports = Facade;
