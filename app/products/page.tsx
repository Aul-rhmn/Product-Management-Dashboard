"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Table, Pagination, Button, Space, Input, Form, message, Spin, Empty, Popconfirm } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LogoutOutlined } from "@ant-design/icons"
import axios from "axios"
import type { ColumnsType } from "antd/es/table"
import ProductModal from "@/components/product-modal"
import { useAuth } from "@/contexts/auth-context"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface Product {
  product_id: string
  product_title: string
  product_price: number
  product_description?: string
  product_image?: string
  product_category?: string
  created_timestamp: string
  updated_timestamp: string
}

interface ApiResponse {
  status_code: string
  is_success: boolean
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    search: string | null
  }
}

export default function ProductsPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  const fetchProducts = useCallback(async (page = 1, search = "") => {
    setLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/products", {
        params: {
          page,
          limit: 10,
          ...(search && { search }),
        },
      })

      if (response.data.is_success) {
        setProducts(response.data.data)
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          total_pages: response.data.pagination.total_pages,
        })
      }
    } catch (error) {
      message.error("Failed to fetch products")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts(1, searchTerm)
    }
  }, [isAuthenticated])

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value)
      fetchProducts(1, value)
    },
    [fetchProducts],
  )

  const handlePageChange = (page: number) => {
    fetchProducts(page, searchTerm)
  }

  const handleCreateClick = () => {
    setEditingProduct(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      product_title: product.product_title,
      product_price: product.product_price,
      product_description: product.product_description,
      product_category: product.product_category,
      product_image: product.product_image,
    })
    setModalVisible(true)
  }

  const handleDeleteClick = async (productId: string) => {
    try {
      const response = await axios.delete("/api/product", {
        params: { product_id: productId },
      })

      if (response.status === 200) {
        message.success("Product deleted successfully")
        fetchProducts(pagination.page, searchTerm)
      } else {
        message.error("Failed to delete product")
      }
    } catch (error: any) {
      console.error("Delete error:", error.response?.data || error.message)
      message.error(error.response?.data?.error || "Failed to delete product")
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditingProduct(null)
    form.resetFields()
  }

  const handleModalSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await axios.put("/api/product", {
          product_id: editingProduct.product_id,
          ...values,
        })
        message.success("Product updated successfully")
      } else {
        await axios.post("/api/product", values)
        message.success("Product created successfully")
      }
      handleModalClose()
      fetchProducts(pagination.page, searchTerm)
    } catch (error) {
      message.error(editingProduct ? "Failed to update product" : "Failed to create product")
      console.error(error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      message.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      message.error("Failed to logout")
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: "Product Title",
      dataIndex: "product_title",
      key: "product_title",
      width: "25%",
      render: (text: string) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      width: "12%",
      render: (price: number) => <span className="font-bold text-blue-600">${price.toFixed(2)}</span>,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
      width: "15%",
      render: (category: string) => (
        <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
          {category || "N/A"}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
      width: "35%",
      render: (description: string) => (
        <span className="text-sm text-gray-600 line-clamp-2">{description || "No description"}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "13%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
            className="bg-blue-500 hover:bg-blue-600 border-0 rounded-lg"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteClick(record.product_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} className="rounded-lg">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in-up">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-1 md:mb-2">
              Product Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Manage your products efficiently with a modern dashboard
            </p>
          </div>
          <Button
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="w-full md:w-auto border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
          >
            Logout
          </Button>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mb-6">
          <Input.Search
            placeholder="Search by title, description, or category..."
            prefix={<SearchOutlined className="text-blue-400" />}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
            size="large"
            allowClear
            style={{ borderRadius: "8px" }}
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-xl transition-all duration-300 rounded-lg font-semibold"
          >
            Create Product
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <Spin spinning={loading}>
            {products.length === 0 && !loading ? (
              <div className="p-6 md:p-8">
                <Empty description="No products found" />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={products}
                rowKey="product_id"
                pagination={false}
                loading={loading}
                scroll={{ x: 800 }}
                className="bg-white"
                size="middle"
              />
            )}
          </Spin>
        </div>

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center mt-6 md:mt-8">
            <Pagination
              current={pagination.page}
              total={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        editingProduct={editingProduct}
        form={form}
      />
    </div>
  )
}
