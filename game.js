let scene, camera, renderer, ultraman, dinosaur;
let health = 5;
let attackPower = 1;
let dinosaurHealth = 100;
let level = 1;
let score = 0;
let bullets = []; // 存储所有子弹
let maxHealth = 10;
let bulletSpeed = 0.3;

// 初始化场景
function init() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // 添加天空背景
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建地面
    const groundGeometry = new THREE.PlaneGeometry(20, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    scene.add(ground);

    // 创建奥特曼（人形猎人）
    const ultramanBody = new THREE.Group();
    
    // 身体
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.2, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    ultramanBody.add(body);

    // 头部
    const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 100 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.8;
    ultramanBody.add(head);

    // 手臂
    const armGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.5, 0.2, 0);
    ultramanBody.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.5, 0.2, 0);
    ultramanBody.add(rightArm);

    // 腿部
    const legGeometry = new THREE.BoxGeometry(0.25, 0.8, 0.25);
    const leftLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    leftLeg.position.set(-0.2, -1, 0);
    ultramanBody.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, bodyMaterial);
    rightLeg.position.set(0.2, -1, 0);
    ultramanBody.add(rightLeg);

    ultraman = ultramanBody;
    scene.add(ultraman);

    // 创建恐龙（霸王龙）
    const dinosaurBody = new THREE.Group();
    
    // 身体
    const dinoBodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const dinosaurMaterial = new THREE.MeshPhongMaterial({ color: 0x008000, shininess: 50 });
    const dinoBody = new THREE.Mesh(dinoBodyGeometry, dinosaurMaterial);
    dinosaurBody.add(dinoBody);

    // 头部
    const dinoHeadGeometry = new THREE.BoxGeometry(1, 0.8, 0.8);
    const dinoHead = new THREE.Mesh(dinoHeadGeometry, dinosaurMaterial);
    dinoHead.position.set(1.2, 0.5, 0);
    dinosaurBody.add(dinoHead);

    // 嘴部
    const jawGeometry = new THREE.BoxGeometry(0.6, 0.3, 0.5);
    const jaw = new THREE.Mesh(jawGeometry, dinosaurMaterial);
    jaw.position.set(1.8, 0.3, 0);
    dinosaurBody.add(jaw);

    // 尾巴
    const tailGeometry = new THREE.BoxGeometry(2, 0.3, 0.3);
    const tail = new THREE.Mesh(tailGeometry, dinosaurMaterial);
    tail.position.set(-1.5, 0, 0);
    dinosaurBody.add(tail);

    // 后腿
    const dinoLegGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
    const leftBackLeg = new THREE.Mesh(dinoLegGeometry, dinosaurMaterial);
    leftBackLeg.position.set(-0.5, -1.5, 0.3);
    dinosaurBody.add(leftBackLeg);

    const rightBackLeg = new THREE.Mesh(dinoLegGeometry, dinosaurMaterial);
    rightBackLeg.position.set(-0.5, -1.5, -0.3);
    dinosaurBody.add(rightBackLeg);

    // 前腿（较小）
    const dinoArmGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const leftFrontLeg = new THREE.Mesh(dinoArmGeometry, dinosaurMaterial);
    leftFrontLeg.position.set(0.5, -0.8, 0.3);
    dinosaurBody.add(leftFrontLeg);

    const rightFrontLeg = new THREE.Mesh(dinoArmGeometry, dinosaurMaterial);
    rightFrontLeg.position.set(0.5, -0.8, -0.3);
    dinosaurBody.add(rightFrontLeg);

    dinosaur = dinosaurBody;
    dinosaur.position.set(5, 1.5, 0); // 调整恐龙的位置
    scene.add(dinosaur);

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 添加键盘控制
    document.addEventListener('keydown', onKeyDown);

    // 立即生成食物和材料
    spawnFood();
    spawnMaterial();
    
    // 每30秒生成食物和材料
    setInterval(spawnFood, 30000);
    setInterval(spawnMaterial, 30000);

    // 更新UI
    updateUI();
}

// 更新UI显示
function updateUI() {
    document.getElementById('info').innerHTML = `
        生命值: <span id="health">${health}</span><br>
        攻击力: <span id="attack">${attackPower}</span><br>
        恐龙生命值: <span id="monsterHealth">${dinosaurHealth}</span><br>
        等级: <span id="level">${level}</span><br>
        分数: <span id="score">${score}</span>
    `;
}

// 键盘控制
function onKeyDown(event) {
    switch(event.key) {
        case 'ArrowLeft':
            ultraman.position.x -= 0.3;
            break;
        case 'ArrowRight':
            ultraman.position.x += 0.3;
            break;
        case 'ArrowUp':
            ultraman.position.y += 0.3;
            break;
        case 'ArrowDown':
            ultraman.position.y -= 0.3;
            break;
        case ' ': // 空格键攻击
            attack();
            break;
        case 'z': // Z键使用技能
            useSkill();
            break;
        case 'b': // B键打开商城
            toggleShop();
            break;
    }
}

// 攻击功能
function attack() {
    if (health > 0) {
        health--;
        createBullet();
        updateUI();
    }
}

// 添加子弹创建函数
function createBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1);
    const bulletMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    // 设置子弹初始位置（从奥特曼位置发射）
    bullet.position.copy(ultraman.position);
    bullet.position.x += 0.5; // 从奥特曼前方发射
    
    // 修改子弹速度
    bullet.velocity = new THREE.Vector3(bulletSpeed, 0, 0);
    
    scene.add(bullet);
    bullets.push(bullet);
    
    // 添加发射特效
    createShootEffect(bullet.position);
}

// 添加发射特效
function createShootEffect(position) {
    const effectGeometry = new THREE.RingGeometry(0.1, 0.2, 16);
    const effectMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
    });
    const effect = new THREE.Mesh(effectGeometry, effectMaterial);
    effect.position.copy(position);
    effect.lookAt(dinosaur.position);
    scene.add(effect);

    // 特效动画
    let opacity = 1;
    function animateEffect() {
        if (opacity <= 0) {
            scene.remove(effect);
            return;
        }
        opacity -= 0.1;
        effect.material.opacity = opacity;
        effect.scale.multiplyScalar(1.1);
        requestAnimationFrame(animateEffect);
    }
    animateEffect();
}

// 添加子弹更新函数
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 更新子弹位置
        bullet.position.add(bullet.velocity);
        
        // 检查子弹是否击中恐龙
        const distance = bullet.position.distanceTo(dinosaur.position);
        if (distance < 1.5) { // 击中判定范围
            // 造成伤害
            dinosaurHealth -= attackPower;
            updateUI();
            
            // 创建击中特效
            createHitEffect(bullet.position);
            
            // 移除子弹
            scene.remove(bullet);
            bullets.splice(i, 1);
            
            // 检查恐龙是否被击败
            if (dinosaurHealth <= 0) {
                score += 100;
                level++;
                alert(`恭喜你击败了恐龙！\n获得100分！\n当前等级：${level}`);
                resetGame();
            }
            continue;
        }
        
        // 移除超出范围的子弹
        if (bullet.position.x > 10 || bullet.position.x < -10 ||
            bullet.position.y > 10 || bullet.position.y < -10) {
            scene.remove(bullet);
            bullets.splice(i, 1);
        }
    }
}

// 添加击中特效
function createHitEffect(position) {
    const effectGeometry = new THREE.SphereGeometry(0.2);
    const effectMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0.8
    });
    const effect = new THREE.Mesh(effectGeometry, effectMaterial);
    effect.position.copy(position);
    scene.add(effect);

    // 特效动画
    let scale = 1;
    function animateEffect() {
        if (scale >= 2) {
            scene.remove(effect);
            return;
        }
        scale += 0.1;
        effect.scale.set(scale, scale, scale);
        effect.material.opacity -= 0.05;
        requestAnimationFrame(animateEffect);
    }
    animateEffect();
}

// 使用技能
function useSkill() {
    if (health >= 2) {
        health -= 2;
        dinosaurHealth -= attackPower * 2;
        createSkillEffect();
        updateUI();
    }
}

// 创建技能特效
function createSkillEffect() {
    const effectGeometry = new THREE.RingGeometry(0.5, 1, 32);
    const effectMaterial = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.8
    });
    const effect = new THREE.Mesh(effectGeometry, effectMaterial);
    effect.position.copy(ultraman.position);
    scene.add(effect);

    // 特效动画
    let scale = 1;
    function animateEffect() {
        if (scale >= 3) {
            scene.remove(effect);
            return;
        }
        scale += 0.1;
        effect.scale.set(scale, scale, 1);
        requestAnimationFrame(animateEffect);
    }
    animateEffect();
}

// 重置游戏
function resetGame() {
    dinosaurHealth = 100 + (level - 1) * 50; // 随等级提高而增加生命值
    health = 5;
    updateUI();
}

// 生成食物
function spawnFood() {
    const foodGeometry = new THREE.SphereGeometry(0.2);
    const foodMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.x = Math.random() * 6 - 3;
    food.position.y = Math.random() * 4 - 2;
    food.isFood = true; // 标记这是食物
    scene.add(food);

    // 30秒后移除食物
    setTimeout(() => {
        scene.remove(food);
    }, 30000);
}

// 生成升级材料
function spawnMaterial() {
    const materialGeometry = new THREE.SphereGeometry(0.2);
    const materialMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    const material = new THREE.Mesh(materialGeometry, materialMaterial);
    material.position.x = Math.random() * 6 - 3;
    material.position.y = Math.random() * 4 - 2;
    material.isMaterial = true; // 标记这是材料
    scene.add(material);

    // 30秒后移除材料
    setTimeout(() => {
        scene.remove(material);
    }, 30000);
}

// 添加碰撞检测函数
function checkCollisions() {
    const ultramanPosition = ultraman.position;
    
    // 检查场景中的所有物体
    scene.children.forEach(object => {
        if (object.isFood || object.isMaterial) {
            const distance = ultramanPosition.distanceTo(object.position);
            
            // 如果距离小于1，认为发生碰撞
            if (distance < 1) {
                if (object.isFood) {
                    // 收集食物，增加生命值
                    health = Math.min(health + 1, maxHealth);
                    updateUI();
                    scene.remove(object);
                } else if (object.isMaterial) {
                    // 收集材料，增加攻击力
                    attackPower += 1;
                    updateUI();
                    scene.remove(object);
                }
            }
        }
    });
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    updateBullets(); // 更新子弹位置和检查碰撞
    checkCollisions(); // 检查食物和材料的碰撞
    renderer.render(scene, camera);
}

// 初始化游戏
init();
animate();

// 窗口大小调整
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 添加商城控制函数
function toggleShop() {
    const shop = document.getElementById('shop');
    shop.style.display = shop.style.display === 'none' ? 'block' : 'none';
}

// 添加购买物品函数
function buyItem(itemType) {
    switch(itemType) {
        case 'health':
            if (score >= 50) {
                health = Math.min(health + 3, maxHealth);
                score -= 50;
                updateUI();
                alert('购买成功！生命值+3');
            } else {
                alert('分数不足！');
            }
            break;
        case 'attack':
            if (score >= 100) {
                attackPower += 2;
                score -= 100;
                updateUI();
                alert('购买成功！攻击力+2');
            } else {
                alert('分数不足！');
            }
            break;
        case 'maxHealth':
            if (score >= 200) {
                maxHealth += 2;
                health = Math.min(health + 2, maxHealth);
                score -= 200;
                updateUI();
                alert('购买成功！最大生命值+2');
            } else {
                alert('分数不足！');
            }
            break;
        case 'bulletSpeed':
            if (score >= 150) {
                bulletSpeed += 0.1;
                score -= 150;
                updateUI();
                alert('购买成功！子弹速度提升');
            } else {
                alert('分数不足！');
            }
            break;
    }
} 