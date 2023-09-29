@namespace
class SpriteKind:
    platform = SpriteKind.create()
    spring = SpriteKind.create()
    enemy = SpriteKind.create()
    pill = SpriteKind.create()
    rain = SpriteKind.create()

# sprites
dino = sprites.create(assets.image("dino"), SpriteKind.player)
dino.set_stay_in_screen(True)

# vars
y_vel = 0
gravity = 5
death_height = 120
next_platform_height = -20
next_enemy_height = -30
bounce_power = 130
horizontal_acceleration = 8
horizontal_deceleration = 0.95

# setup
scene.set_background_color(1)
info.set_score(1000)

def create_platform():
    asset = assets.image("platform")
    platform = sprites.create(asset, SpriteKind.platform)
    y_spawn = scene.camera_property(CameraProperty.TOP) + 1
    platform.x = randint(12, 148)
    platform.bottom = y_spawn

def create_spring():
    spring = assets.image("spring")
    platform = sprites.create(spring, SpriteKind.spring)
    y_spawn = scene.camera_property(CameraProperty.TOP) + 1
    platform.x = randint(12, 148)
    platform.bottom = y_spawn


def create_enemy():
    enemy = assets.image("top G")
    pill_asset = assets.image("Original Rhubarb and custards 500g")
    top_g = sprites.create(enemy, SpriteKind.enemy)
    top_g.set_position(80, next_platform_height - 20)
    top_g.set_velocity(50, 0)
    pill = sprites.create(pill_asset, SpriteKind.pill)
    pill.set_position(top_g.x, top_g.y)
    pill.set_velocity(0, 20)

def create_super_enemy():
    enemy = assets.image("top G super")
    pill_asset = assets.image("Original Rhubarb and custards 500 rainbow")
    top_g_super = sprites.create(enemy, SpriteKind.enemy)
    top_g_super.set_position(80, next_platform_height - 20)
    top_g_super.set_velocity(50, 0)
    pill = sprites.create(pill_asset, SpriteKind.rain)
    pill.set_position(top_g_super.x, top_g_super.y)
    pill.set_velocity(0, 20)

def generate_start_platforms():
    for i in range(5):
        platform = sprites.create(assets.image("platform"), SpriteKind.platform)
        pos = (i * 32) + randint(12, 20)
        platform.set_position(pos, 100)
    y = 60
    for i in range(2):
        platform = sprites.create(assets.image("platform"), SpriteKind.platform)
        platform.set_position(randint(12, 148), y)
        y -= 40
generate_start_platforms()

def generate_new_platforms():
    global next_platform_height
    if randint(1, 1) == 1:
        if randint(1, 9) == 1:
            create_spring()
        for i in range(randint(1, 2)):
            create_platform()
    else:
        create_platform()
    if randint(1, 5) == 1:
        create_enemy()
        if randint(0, 1) ==1:
            create_super_enemy()

    next_platform_height -= randint(15, 40)

def bounce(dino, platform):
    global y_vel
    if dino.y > platform.y or y_vel < -bounce_power:
        return
    while dino.overlaps_with(platform):
        dino.y -= 1
    y_vel = -bounce_power
sprites.on_overlap(SpriteKind.player, SpriteKind.platform, bounce)

def bounce_spring(dino, spring):
    global y_vel
    if dino.y > spring.y or y_vel < -bounce_power:
        return
    while dino.overlaps_with(spring):
        dino.y -= 1
    y_vel = -bounce_power - 300
sprites.on_overlap(SpriteKind.player, SpriteKind.spring, bounce_spring)

def handle_rise_and_fall():
    global y_vel, death_height
    y_vel += gravity
    dino.vy = y_vel
    scene.center_camera_at(80, dino.y)
    # if -dino.y + 60 > info.score():
    #     info.set_score(-dino.y + 60)
    if death_height > scene.camera_property(CameraProperty.BOTTOM) + 30:
        death_height = scene.camera_property(CameraProperty.BOTTOM) + 30
    if next_platform_height > scene.camera_property(CameraProperty.TOP):
        generate_new_platforms()

def remove_platforms():
    for platform in sprites.all_of_kind(SpriteKind.platform):
        if platform.top - dino.y >= 60:
            platform.destroy()
game.on_update_interval(1000, remove_platforms)

def horitzontal_movement():
    if controller.left.is_pressed():
        dino.vx -= horizontal_acceleration
    elif controller.right.is_pressed():
        dino.vx += horizontal_acceleration
    dino.vx *= horizontal_deceleration

def tick():
    horitzontal_movement()
    handle_rise_and_fall()
    if dino.y > death_height:
        game.over(False)
    top_g_bonce_or_destroy_gangsta()
game.on_update(tick)

def hit_top_g(player, top_g):
    if y_vel > -bounce_power:
        game.over(False)

def take_my_money(player):
    print("normal")
    info.change_score_by(-10)
    pause(1000)
def take_my_money_ahh(player):
    print("rainbow")
    info.change_score_by(-90)
    pause(1000)


#sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, hit_top_g)
sprites.on_overlap(SpriteKind.player, SpriteKind.pill, take_my_money)
sprites.on_overlap(SpriteKind.player, SpriteKind.rain, take_my_money_ahh)

def top_g_bonce_or_destroy_gangsta():
    for top_g in sprites.all_of_kind(SpriteKind.enemy):
        if top_g.top - dino.y >= 60:
            top_g.destroy()
        if top_g.right >= 160 or top_g.left <= 0:
            top_g.vx *= -1

def top_g_bonce_or_destroy_super_gangsta():
    for top_g_super in sprites.all_of_kind(SpriteKind.enemy):
        if top_g_super.top - dino.y >= 60:
            top_g_super.destroy()
        if top_g_super.right >= 160 or top_g_super.left <= 0:
            top_g_super.vx *= -1