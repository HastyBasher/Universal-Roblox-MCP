# Common Roblox DataTypes Reference

## Vector3

Represents a 3D position or direction with X, Y, Z components.

### Constructor
```lua
local vec = Vector3.new(x, y, z)
local zero = Vector3.zero
local one = Vector3.one
```

### Properties
```lua
vec.X  -- X component
vec.Y  -- Y component
vec.Z  -- Z component
vec.Magnitude  -- Length of the vector
vec.Unit  -- Normalized vector (length = 1)
```

### Common Operations
```lua
-- Arithmetic
local sum = vec1 + vec2
local diff = vec1 - vec2
local scaled = vec * 5
local divided = vec / 2

-- Distance
local distance = (pos1 - pos2).Magnitude

-- Direction
local direction = (target - origin).Unit

-- Linear interpolation
local lerp = vec1:Lerp(vec2, alpha)  -- alpha = 0 to 1

-- Common positions
local up = Vector3.new(0, 1, 0)
local down = Vector3.new(0, -1, 0)
local forward = Vector3.new(0, 0, -1)
local backward = Vector3.new(0, 0, 1)
```

---

## CFrame (Coordinate Frame)

Represents position and rotation in 3D space.

### Constructor
```lua
-- Position only
local cf = CFrame.new(0, 10, 0)

-- Position and look-at
local cf = CFrame.new(0, 10, 0, lookAtPos)

-- From components (position + rotation matrix)
local cf = CFrame.new(x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22)

-- From angles (Euler angles)
local cf = CFrame.Angles(math.rad(x), math.rad(y), math.rad(z))
```

### Properties
```lua
cf.Position  -- Vector3 position
cf.LookVector  -- Vector3 forward direction
cf.UpVector  -- Vector3 up direction
cf.RightVector  -- Vector3 right direction
```

### Common Operations
```lua
-- Apply to part
part.CFrame = cf

-- Combine CFrames
local combined = cf1 * cf2

-- Offset position
local offset = part.CFrame + Vector3.new(0, 5, 0)

-- Look at target
local lookCf = CFrame.lookAt(position, target)

-- Rotate
local rotated = cf * CFrame.Angles(0, math.rad(90), 0)
```

---

## UDim2

Used for GUI sizing and positioning with scale and offset.

### Constructor
```lua
-- UDim2.new(scale.x, offset.x, scale.y, offset.y)
local udim2 = UDim2.new(0.5, 0, 0.5, 0)  -- Center position
local size = UDim2.new(1, 0, 1, 0)  -- Full size

-- Named constructors
local fromScale = UDim2.fromScale(0.5, 0.5)  -- Scale only
local fromOffset = UDim2.fromOffset(100, 50)  -- Offset only
```

### Properties
```lua
udim2.X.Scale  -- Horizontal scale (0-1 = 0%-100%)
udim2.X.Offset  -- Horizontal offset in pixels
udim2.Y.Scale  -- Vertical scale
udim2.Y.Offset  -- Vertical offset in pixels
```

### Common Usage
```lua
-- Responsive GUI (scales with screen)
frame.Size = UDim2.new(0.5, 0, 0.5, 0)

-- Fixed size (pixels)
frame.Size = UDim2.new(0, 200, 0, 100)

-- Hybrid (scales but with padding)
frame.Size = UDim2.new(1, -20, 1, -20)  -- Full size minus 20px padding

-- Center positioning
frame.Position = UDim2.new(0.5, -100, 0.5, -50)  -- Center with offset
frame.AnchorPoint = Vector2.new(0.5, 0.5)
```

---

## Color3

Represents an RGB color.

### Constructor
```lua
local color = Color3.new(r, g, b)  -- Values 0-1
local red = Color3.new(1, 0, 0)
local green = Color3.fromRGB(0, 255, 0)  -- 0-255
local blue = Color3.fromHex("#0000FF")
```

### Properties
```lua
color.R  -- Red component (0-1)
color.G  -- Green component (0-1)
color.B  -- Blue component (0-1)
```

### Common Operations
```lua
-- Predefined colors
local brickColor = BrickColor.new("Bright red")
local color = brickColor.Color

-- Color interpolation
local lerped = color1:Lerp(color2, alpha)

-- Convert to HSV
local hue, sat, val = color:ToHSV()

-- Convert from HSV
local fromHSV = Color3.fromHSV(hue, sat, val)
```

---

## NumberRange

Represents a range between two numbers.

### Constructor
```lua
local range = NumberRange.new(min, max)
local single = NumberRange.new(5)  -- min = max = 5
```

### Properties
```lua
range.Min  -- Minimum value
range.Max  -- Maximum value
```

### Common Usage
```lua
-- For randomized values
local damage = NumberRange.new(10, 20)
local actualDamage = math.random(damage.Min, damage.Max)
```

---

## NumberSequence

Used for gradient-based values (like particle transparency/size over time).

### Constructor
```lua
-- Single keyframe
local seq = NumberSequence.new(0.5)

-- Multiple keyframes
local seq = NumberSequence.new({
    NumberSequenceKeypoint.new(0, 1),      -- Start at 1
    NumberSequenceKeypoint.new(0.5, 0.5),  -- Mid at 0.5
    NumberSequenceKeypoint.new(1, 0),      -- End at 0
})
```

---

## ColorSequence

Similar to NumberSequence but for colors.

### Constructor
```lua
local colorSeq = ColorSequence.new(Color3.new(1, 0, 0))

-- Multiple keyframes
local gradient = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.new(1, 0, 0)),   -- Start red
    ColorSequenceKeypoint.new(1, Color3.new(0, 0, 1)),   -- End blue
})
```

---

## Rect

Represents a 2D rectangle.

### Constructor
```lua
local rect = Rect.new(min, max)  -- Vector2 positions
local rect = Rect.new(0, 0, 100, 100)  -- x, y, x2, y2
```

### Properties
```lua
rect.Min  -- Top-left corner (Vector2)
rect.Max  -- Bottom-right corner (Vector2)
rect.Width  -- Width in pixels
rect.Height  -- Height in pixels
```

---

## Region3

Represents a 3D region in world space.

### Constructor
```lua
local region = Region3.new(center, size)
local fromCorners = Region3.new(minCorner, maxCorner)
```

### Common Operations
```lua
-- Find parts in region
local parts = workspace:FindPartsInRegion3(region, ignoreDescendant, maxParts)

-- Find parts with whitelist
local parts = workspace:FindPartsInRegion3WithWhiteList(region, whitelist, maxParts)
```

---

## Raycast Params

Parameters for raycasting operations.

### Constructor
```lua
local params = RaycastParams.new()
```

### Properties
```lua
params.FilterDescendantsInstances = {workspace.Part}  -- Filter list
params.FilterType = Enum.RaycastFilterType.Exclude  -- or Blacklist (deprecated)
params.IgnoreWater = true
params.CollisionGroup = "Players"
```

---

## RaycastHit

Result from a successful raycast.

### Properties
```lua
hit.Instance  -- The part hit
hit.Position  -- World position of impact
hit.Material  -- Material of the part
hit.Normal  -- Surface normal at impact point
```

### Example
```lua
local rayOrigin = character.Head.Position
local rayDirection = Vector3.new(0, -100, 0)
local params = RaycastParams.new()
params.FilterDescendantsInstances = {character}
params.FilterType = Enum.RaycastFilterType.Exclude

local result = workspace:Raycast(rayOrigin, rayDirection, params)
if result then
    print("Hit:", result.Instance.Name, "at", result.Position)
end
```

---

## TweenInfo

Parameters for TweenService animations.

### Constructor
```lua
local info = TweenInfo.new(
    duration,          -- Time in seconds
    easingStyle,       -- Enum.EasingStyle
    easingDirection,   -- Enum.EasingDirection
    repeatCount,       -- -1 for infinite
    reverses,          -- Boolean
    delayTime          -- Delay before start
)
```

### Example
```lua
local TweenService = game:GetService("TweenService")

local tweenInfo = TweenInfo.new(
    1,                              -- 1 second duration
    Enum.EasingStyle.Quad,          -- Quad easing
    Enum.EasingDirection.Out,       -- Out direction
    0,                              -- No repeat
    false,                          -- Don't reverse
    0                               -- No delay
)

local goals = {
    Position = Vector3.new(0, 10, 0),
    Size = Vector3.new(2, 2, 2)
}

local tween = TweenService:Create(part, tweenInfo, goals)
tween:Play()
```
