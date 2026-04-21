const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  // ĐÃ XÓA: mau_sac
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  gia: {
    type: Number,
    required: true,
  },
  ton_kho: {
    type: Number,
    default: 0,
  },
  anh_bien_the: String,
});
