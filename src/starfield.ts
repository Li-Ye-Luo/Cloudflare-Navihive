// src/starfield.ts

export function initStarfield() {
    const canvas = document.getElementById('starfield') as HTMLCanvasElement | null;
    if (!canvas) {
        console.error("Canvas element with ID 'starfield' not found.");
        return; 
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Could not get 2D context for canvas.");
        return;
    }
    
    // --- 配置 ---
    const numStars = 500; // 星星数量
    const baseSpeed = 0.5; // 基础流动速度
    let w: number, h: number;
    // ------------

    // 1. 星星数据结构
    interface Star {
        x: number;
        y: number;
        z: number; // 深度，用于视差和大小
        radius: number;
        speed: number;
    }

    const stars: Star[] = [];

    // 2. 尺寸设置和初始化
    function setSize() {
        w = canvas!.width = window.innerWidth;
        h = canvas!.height = window.innerHeight;
    }
    setSize();
    window.addEventListener('resize', setSize);

    // 3. 初始化星星数据
    function createStars() {
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * w,
                y: Math.random() * h,
                z: Math.random() * w, // 随机深度
                radius: Math.random() * 2 + 0.5, // 星星大小
                speed: baseSpeed,
            });
        }
    }
    createStars();

    // 4. 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 清空画布 (或绘制黑色背景)
        ctx!.fillStyle = '#000';
        ctx!.fillRect(0, 0, w, h);

        stars.forEach(star => {
            // A. 更新位置 (流动效果)
            // 速度与深度 z 成反比，实现近快远慢的视差效果
            const adjustedSpeed = star.speed * (1 - (star.z / w)) * 5; 
            star.x -= adjustedSpeed;
            
            // 如果星星流出左边界，将其重置到右边界
            if (star.x < 0) {
                star.x = w;
                star.y = Math.random() * h;
                star.z = Math.random() * w;
            }

            // B. 绘制星星
            ctx!.beginPath();
            
            // 颜色和透明度也与深度相关，近处更亮
            const opacity = 1 - (star.z / w); 
            ctx!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            
            // 星星半径也与深度相关
            const adjustedRadius = star.radius * opacity; 

            ctx!.arc(star.x, star.y, adjustedRadius, 0, Math.PI * 2);
            ctx!.fill();
        });
    }

    animate();
}