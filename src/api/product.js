import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000'

function fetchProductList(query) {
  return axios({
    url: `${baseUrl}/api/product/`,
    method: 'get',
    params: query
  })
}

function fetchProductCategory() {
  return axios({
    url: `${baseUrl}/api/category/`,
    method: 'get'
  })
}

function addProduct(form) {
  return axios({
    url: `${baseUrl}/api/product/`,
    method: 'post',
    data: form
  })
}

function editProduct(form) {
  return axios({
    url: `${baseUrl}/api/product/${form.product_id}/`,
    method: 'put',
    data: form
  })
}

function deleteProduct(productId) {
  return axios({
    url: `${baseUrl}/api/product/${productId}/`,
    method: 'delete',
    data: {
      productId
    }
  })
}

module.exports = {
  fetchProductList,
  fetchProductCategory,
  addProduct,
  editProduct,
  deleteProduct
}
