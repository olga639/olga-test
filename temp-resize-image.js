/**
 * 临时图片处理脚本
 * 将图片调整为指定规格：150x200像素，JPG格式，≤1MB
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function resizeImage(inputPath, outputPath) {
  try {
    console.log('\n🖼️  开始处理图片...\n');
    
    // 检查输入文件是否存在
    if (!existsSync(inputPath)) {
      throw new Error(`输入图片不存在: ${inputPath}`);
    }

    // 获取原始文件信息
    const inputStats = statSync(inputPath);
    console.log(`📁 原始文件: ${inputPath}`);
    console.log(`📊 原始大小: ${(inputStats.size / 1024).toFixed(2)} KB`);

    // 处理图片：调整尺寸为 150x200，转换为 JPG，优化质量
    await sharp(inputPath)
      .resize(150, 200, {
        fit: 'cover',           // 覆盖模式，保持比例裁剪
        position: 'center'       // 居中裁剪
      })
      .jpeg({
        quality: 90,             // 高质量
        progressive: true,       // 渐进式加载
        mozjpeg: true           // 使用 mozjpeg 优化
      })
      .toFile(outputPath);

    // 获取输出文件信息
    const outputStats = statSync(outputPath);
    const outputSizeKB = outputStats.size / 1024;
    const outputSizeMB = outputSizeKB / 1024;

    console.log(`\n✅ 处理完成！\n`);
    console.log(`📁 输出文件: ${outputPath}`);
    console.log(`📊 输出大小: ${outputSizeKB.toFixed(2)} KB (${outputSizeMB.toFixed(2)} MB)`);
    console.log(`📐 输出尺寸: 150 × 200 像素`);
    console.log(`📄 输出格式: JPG`);

    // 检查大小是否符合要求
    if (outputSizeMB > 1) {
      console.log(`\n⚠️  警告: 文件大小 ${outputSizeMB.toFixed(2)} MB 超过 1MB 限制`);
      console.log(`💡 建议: 降低质量或进一步压缩`);
    } else {
      console.log(`\n✅ 文件大小符合要求 (≤ 1MB)`);
    }

  } catch (error) {
    console.error('\n❌ 处理失败:', error.message);
    throw error;
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log(`
使用方法:
  node temp-resize-image.js <输入图片路径> [输出文件名]

示例:
  node temp-resize-image.js photo.jpg
  node temp-resize-image.js photo.jpg output.jpg
  node temp-resize-image.js ~/Downloads/photo.jpg processed-photo.jpg

说明:
  - 输入图片路径: 要处理的图片文件路径
  - 输出文件名: (可选) 默认为 'photo-150x200.jpg'
  - 输出目录: ../其他/
  - 处理规格: 150×200像素, JPG格式, ≤1MB
`);
    process.exit(1);
  }

  const inputPath = args[0];
  const outputFileName = args[1] || 'photo-150x200.jpg';
  const outputDir = join(__dirname, '..', '其他');
  const outputPath = join(outputDir, outputFileName);

  await resizeImage(inputPath, outputPath);
}

main().catch(error => {
  console.error('执行失败:', error);
  process.exit(1);
});


