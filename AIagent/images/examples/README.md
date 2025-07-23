# 示例图片资源

## 图片来源

所有图片均来自Unsplash，根据Unsplash许可协议使用，无需归属。

## 图片列表

1. **客厅1** - 现代简约客厅毛坯 (Grovemade)
   - 来源: https://unsplash.com/photos/empty-living-room-vfIx29EsLHA
   - 处理: 调整亮度和对比度，裁剪为3:4比例

2. **客厅2** - 开放式客厅毛坯 (Thanos Pal)
   - 来源: https://unsplash.com/photos/a-room-filled-with-furniture-and-a-table-lbi9B6wsHPo
   - 处理: 调整亮度和对比度，裁剪为3:4比例

3. **卧室** - 主卧室毛坯空间 (刘强)
   - 来源: https://unsplash.com/photos/gray-bed-in-bedroom-R5v8Xtc0ecg
   - 处理: 调整亮度和对比度，裁剪为3:4比例

4. **厨房** - 开放式厨房毛坯 (Jason Leung)
   - 来源: https://unsplash.com/photos/white-wooden-kitchen-cabinet-7iuasVqkUjs
   - 处理: 调整亮度和对比度，裁剪为3:4比例

5. **卫生间** - 现代风格卫生间毛坯 (Sidekix Media)
   - 来源: https://unsplash.com/photos/white-ceramic-sink-near-white-ceramic-sink-g51F6-WYzyU
   - 处理: 调整亮度和对比度，裁剪为3:4比例

6. **书房** - 简约风格书房毛坯 (Ron McClenny)
   - 来源: https://unsplash.com/photos/yellow-rolling-chair-near-window-9yI8eQ9mdvY
   - 处理: 调整亮度和对比度，裁剪为3:4比例

## 图片处理步骤

1. 从Unsplash下载原始高清图片
2. 使用图片处理软件(如Photoshop或GIMP)进行以下处理:
   - 调整亮度和对比度，确保图片清晰且风格一致
   - 裁剪为3:4比例(1080×1440像素)
   - 保存为高质量JPG格式
3. 创建缩略图版本(300×400像素)
4. 将图片按照命名规则保存到对应目录

## 目录结构

```
images/
└── examples/
    ├── living-room-1.jpg  # 客厅1原图
    ├── living-room-2.jpg  # 客厅2原图
    ├── bedroom-1.jpg      # 卧室原图
    ├── kitchen-1.jpg      # 厨房原图
    ├── bathroom-1.jpg     # 卫生间原图
    ├── study-room-1.jpg   # 书房原图
    ├── thumbnails/        # 缩略图目录
    │   ├── living-room-1.jpg
    │   ├── living-room-2.jpg
    │   ├── bedroom-1.jpg
    │   ├── kitchen-1.jpg
    │   ├── bathroom-1.jpg
    │   └── study-room-1.jpg
    ├── example-images.json # 图片数据结构
    └── README.md          # 本说明文档
``` 