"use client"

import { Modal, Form, Input, InputNumber, Button } from "antd"
import type { FormInstance } from "antd"
import type { Product } from "@/types/product"

interface ProductModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (values: any) => Promise<void>
  editingProduct: Product | null
  form: FormInstance
}

export default function ProductModal({ visible, onClose, onSubmit, editingProduct, form }: ProductModalProps) {
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  return (
    <Modal
      title={
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {editingProduct ? "Edit Product" : "Create New Product"}
        </span>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="border-gray-300 rounded-lg font-semibold">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-lg rounded-lg font-semibold"
        >
          {editingProduct ? "Update" : "Create"}
        </Button>,
      ]}
      width={window.innerWidth < 640 ? "95vw" : 600}
      className="rounded-2xl"
      bodyStyle={{ borderRadius: "16px" }}
      style={{ maxWidth: "95vw" }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label={<span className="font-semibold text-gray-700">Product Title</span>}
          name="product_title"
          rules={[
            { required: true, message: "Please enter product title" },
            { min: 3, message: "Title must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter product title" size="large" className="rounded-lg border-gray-300" />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Price</span>}
          name="product_price"
          rules={[
            { required: true, message: "Please enter product price" },
            { type: "number", min: 0, message: "Price must be positive" },
          ]}
        >
          <InputNumber
            placeholder="Enter product price"
            size="large"
            min={0}
            step={0.01}
            precision={2}
            className="w-full rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Description</span>}
          name="product_description"
          rules={[{ max: 500, message: "Description must not exceed 500 characters" }]}
        >
          <Input.TextArea
            placeholder="Enter product description (optional)"
            rows={4}
            className="rounded-lg border-gray-300"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Category</span>}
          name="product_category"
          rules={[{ max: 100, message: "Category must not exceed 100 characters" }]}
        >
          <Input placeholder="Enter product category (optional)" size="large" className="rounded-lg border-gray-300" />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Image URL</span>}
          name="product_image"
          rules={[
            { type: "url", message: "Please enter a valid URL" },
            { max: 500, message: "URL must not exceed 500 characters" },
          ]}
        >
          <Input placeholder="Enter product image URL (optional)" size="large" className="rounded-lg border-gray-300" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
