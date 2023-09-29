namespace SpriteKind {
    export const platform = SpriteKind.create()
    export const spring = SpriteKind.create()
    export const enemy = SpriteKind.create()
    export const pill = SpriteKind.create()
    export const rain = SpriteKind.create()
}

//  sprites
let dino = sprites.create(assets.image`dino`, SpriteKind.Player)
dino.setStayInScreen(true)
//  vars
let y_vel = 0
let gravity = 5
let death_height = 120
let next_platform_height = -20
let next_enemy_height = -30
let bounce_power = 130
let horizontal_acceleration = 8
let horizontal_deceleration = 0.95
//  setup
scene.setBackgroundColor(1)
info.setScore(1000)
function create_platform() {
    let asset = assets.image`platform`
    let platform = sprites.create(asset, SpriteKind.platform)
    let y_spawn = scene.cameraProperty(CameraProperty.Top) + 1
    platform.x = randint(12, 148)
    platform.bottom = y_spawn
}

function create_spring() {
    let spring = assets.image`spring`
    let platform = sprites.create(spring, SpriteKind.spring)
    let y_spawn = scene.cameraProperty(CameraProperty.Top) + 1
    platform.x = randint(12, 148)
    platform.bottom = y_spawn
}

function create_enemy() {
    let enemy = assets.image`top G`
    let pill_asset = assets.image`Original Rhubarb and custards 500g`
    let top_g = sprites.create(enemy, SpriteKind.enemy)
    top_g.setPosition(80, next_platform_height - 20)
    top_g.setVelocity(50, 0)
    let pill = sprites.create(pill_asset, SpriteKind.pill)
    pill.setPosition(top_g.x, top_g.y)
    pill.setVelocity(0, 20)
}

function create_super_enemy() {
    let enemy = assets.image`top G super`
    let pill_asset = assets.image`Original Rhubarb and custards 500 rainbow`
    let top_g_super = sprites.create(enemy, SpriteKind.enemy)
    top_g_super.setPosition(80, next_platform_height - 20)
    top_g_super.setVelocity(50, 0)
    let pill = sprites.create(pill_asset, SpriteKind.rain)
    pill.setPosition(top_g_super.x, top_g_super.y)
    pill.setVelocity(0, 20)
}

function generate_start_platforms() {
    let i: number;
    let platform: Sprite;
    let pos: number;
    for (i = 0; i < 5; i++) {
        platform = sprites.create(assets.image`platform`, SpriteKind.platform)
        pos = i * 32 + randint(12, 20)
        platform.setPosition(pos, 100)
    }
    let y = 60
    for (i = 0; i < 2; i++) {
        platform = sprites.create(assets.image`platform`, SpriteKind.platform)
        platform.setPosition(randint(12, 148), y)
        y -= 40
    }
}

generate_start_platforms()
function generate_new_platforms() {
    
    if (randint(1, 1) == 1) {
        if (randint(1, 9) == 1) {
            create_spring()
        }
        
        for (let i = 0; i < randint(1, 2); i++) {
            create_platform()
        }
    } else {
        create_platform()
    }
    
    if (randint(1, 5) == 1) {
        create_enemy()
        if (randint(0, 1) == 1) {
            create_super_enemy()
        }
        
    }
    
    next_platform_height -= randint(15, 40)
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.platform, function bounce(dino: Sprite, platform: Sprite) {
    
    if (dino.y > platform.y || y_vel < -bounce_power) {
        return
    }
    
    while (dino.overlapsWith(platform)) {
        dino.y -= 1
    }
    y_vel = -bounce_power
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.spring, function bounce_spring(dino: Sprite, spring: Sprite) {
    
    if (dino.y > spring.y || y_vel < -bounce_power) {
        return
    }
    
    while (dino.overlapsWith(spring)) {
        dino.y -= 1
    }
    y_vel = -bounce_power - 300
})
function handle_rise_and_fall() {
    
    y_vel += gravity
    dino.vy = y_vel
    scene.centerCameraAt(80, dino.y)
    //  if -dino.y + 60 > info.score():
    //      info.set_score(-dino.y + 60)
    if (death_height > scene.cameraProperty(CameraProperty.Bottom) + 30) {
        death_height = scene.cameraProperty(CameraProperty.Bottom) + 30
    }
    
    if (next_platform_height > scene.cameraProperty(CameraProperty.Top)) {
        generate_new_platforms()
    }
    
}

game.onUpdateInterval(1000, function remove_platforms() {
    for (let platform of sprites.allOfKind(SpriteKind.platform)) {
        if (platform.top - dino.y >= 60) {
            platform.destroy()
        }
        
    }
})
function horitzontal_movement() {
    if (controller.left.isPressed()) {
        dino.vx -= horizontal_acceleration
    } else if (controller.right.isPressed()) {
        dino.vx += horizontal_acceleration
    }
    
    dino.vx *= horizontal_deceleration
}

game.onUpdate(function tick() {
    horitzontal_movement()
    handle_rise_and_fall()
    if (dino.y > death_height) {
        game.over(false)
    }
    
    top_g_bonce_or_destroy_gangsta()
})
function hit_top_g(player: any, top_g: any) {
    if (y_vel > -bounce_power) {
        game.over(false)
    }
    
}

// sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, hit_top_g)
sprites.onOverlap(SpriteKind.Player, SpriteKind.pill, function take_my_money(player: any) {
    console.log("normal")
    info.changeScoreBy(-10)
    pause(1000)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.rain, function take_my_money_ahh(player: any) {
    console.log("rainbow")
    info.changeScoreBy(-90)
    pause(1000)
})
function top_g_bonce_or_destroy_gangsta() {
    for (let top_g of sprites.allOfKind(SpriteKind.enemy)) {
        if (top_g.top - dino.y >= 60) {
            top_g.destroy()
        }
        
        if (top_g.right >= 160 || top_g.left <= 0) {
            top_g.vx *= -1
        }
        
    }
}

function top_g_bonce_or_destroy_super_gangsta() {
    for (let top_g_super of sprites.allOfKind(SpriteKind.enemy)) {
        if (top_g_super.top - dino.y >= 60) {
            top_g_super.destroy()
        }
        
        if (top_g_super.right >= 160 || top_g_super.left <= 0) {
            top_g_super.vx *= -1
        }
        
    }
}

