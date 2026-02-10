/**
 * Roblox MCP Resources
 *
 * Static information resources for Roblox development.
 */

import { Resource } from '@modelcontextprotocol/sdk/types.js';

// Content files
const BEST_PRACTICES = `# Roblox Development Best Practices

## General Principles

### 1. Client-Server Architecture
- **Keep logic on the server** when possible for security and consistency
- Use **RemoteEvents/RemoteFunctions** for client-server communication
- Validate all inputs from the client on the server
- Use **ReplicatedStorage** for shared client/server objects

### 2. Performance
- Use **object pooling** for frequently created/destroyed objects
- Avoid **Wait()** - use \`task.wait()\` or events instead
- Use **CollectionService** with tags for organized object management
- Prefer \`instance:Destroy()\` over \`instance:Remove()\` (deprecated)
- Use **workspace**:WaitForChild() with timeout to prevent infinite waits

### 3. Memory Management
- Disconnect events when objects are destroyed: \`connection:Disconnect()\`
- Clean up **references** to destroyed objects
- Use **weak references** where appropriate
- Avoid storing player data in scripts (use DataStores)

## Script Organization

### Folder Structure
\`\`\`
game
├── ReplicatedStorage
│   └── SharedModules          # Shared ModuleScripts
├── ServerScriptService
│   ├── ServerScripts          # Game logic scripts
│   └── DataStoreScripts       # Data management
├── StarterPlayer
│   ├── StarterPlayerScripts   # Client-side logic
│   └── StarterGui             # Initial GUI elements
└── StarterGui                 # Shared GUI
\`\`\`

### ModuleScript Best Practices
- Always return a table or function
- Use **local** variables for internal state
- Document exported functions with comments
- Avoid circular dependencies

## Instance Management

### Hierarchy Best Practices
- Use **Folder** and **Model** objects to organize
- Name instances descriptively
- Use **CollectionService** tags for runtime identification
- Keep the hierarchy reasonably flat (avoid 10+ levels deep)

### Common Services
- \`Players\` - Player management
- \`ReplicatedStorage\` - Shared data
- \`ServerStorage\` - Server-only data
- \`Workspace\` - Physical game world
- \`Lighting\` - Visual effects
- \`SoundService\` - Audio management

## Property Management

### Common Property Patterns
\`\`\`lua
-- Anchoring parts for building
part.Anchored = true

-- Making parts invisible but collidable
part.Transparency = 1
part.CanCollide = true

-- Making GUI elements interactive
guiButton.Active = true
guiButton.Selectable = true
\`\`\`

## Scripting Patterns

### WaitForChild Pattern
\`\`\`lua
-- Safe pattern with timeout
local part = workspace:WaitForChild("Part", 5)
if part then
    -- Do something with part
end
\`\`\`

### Event Connection Pattern
\`\`\`lua
-- Always store connections for cleanup
local connection = part.Touched:Connect(function(hit)
    -- Handle touch
end)

-- Clean up later
connection:Disconnect()
\`\`\`

### CollectionService Pattern
\`\`\`lua
-- Tag-based object management
local CollectionService = game:GetService("CollectionService")

local function onInstanceAdded(instance)
    -- Initialize tagged object
end

local function onInstanceRemoved(instance)
    -- Clean up tagged object
end

-- Connect to tag
CollectionService:GetInstanceAddedSignal("MyTag"):Connect(onInstanceAdded)
CollectionService:GetInstanceRemovedSignal("MyTag"):Connect(onInstanceRemoved)

-- Initialize existing tagged objects
for _, instance in CollectionService:GetTagged("MyTag") do
    onInstanceAdded(instance)
end
\`\`\`

## Error Handling

### pcall Pattern
\`\`\`lua
local success, result = pcall(function()
    return riskyFunction()
end)

if success then
    -- Use result
else
    warn("Error:", result)
end
\`\`\`

### assert Pattern
\`\`\`lua
local player = getPlayer()
assert(player, "Player not found")
\`\`\`

## Common Pitfalls to Avoid

1. **Don't use \`game.Players.PlayerAdded\` after players have joined** - use a function that checks for existing players too
2. **Don't modify \`game.Players\`** - use the service events
3. **Don't use infinite loops without delays** - always add \`task.wait()\`
4. **Don't forget to disconnect events** - memory leaks will occur
5. **Don't trust client input** - always validate on the server
6. **Don't use deprecated APIs** - check the documentation

## Useful APIs

- \`task.wait()\` - Modern wait function
- \`task.spawn()\` - Run function without yielding
- \`task.defer()\` - Run function on next cycle
- \`game:GetService()\` - Get service reference
- \`instance:Clone()\` - Copy an instance
- \`instance:Destroy()\` - Clean up an instance
- \`instance:WaitForChild()\` - Wait for child to load
`;

const CLIENT_SERVER_PATTERNS = `# Client-Server Communication Patterns

## Overview

Roblox uses a **client-server model** where:
- **Server** - Authoritative game logic, runs on Roblox servers
- **Client** - Each player's local game, runs on their device

## Communication Methods

### RemoteEvents
Best for **one-way** communication (fire and forget)

\`\`\`lua
-- Server script
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = ReplicatedStorage:WaitForChild("MyRemoteEvent")

-- Server listens for client calls
remoteEvent.OnServerEvent:Connect(function(player, arg1, arg2)
    -- Handle client request
    -- 'player' is automatically passed as first argument
end)

-- Server fires to all clients
remoteEvent:FireAllClients(data)

-- Server fires to specific client
remoteEvent:FireClient(player, data)
\`\`\`

\`\`\`lua
-- LocalScript (client)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = ReplicatedStorage:WaitForChild("MyRemoteEvent")

-- Client fires to server
remoteEvent:FireServer(arg1, arg2)

-- Client listens for server
remoteEvent.OnClientEvent:Connect(function(arg1, arg2)
    -- Handle server message
end)
\`\`\`

### RemoteFunctions
Best for **two-way** communication (request/response)

\`\`\`lua
-- Server script
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteFunction = ReplicatedStorage:WaitForChild("MyRemoteFunction")

remoteFunction.OnServerInvoke = function(player, arg1)
    -- Process request and return result
    return "server response"
end
\`\`\`

\`\`\`lua
-- LocalScript (client)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteFunction = ReplicatedStorage:WaitForChild("MyRemoteFunction")

local result = remoteFunction:InvokeServer(arg1)
print("Server responded:", result)
\`\`\`

## Common Patterns

### Pattern 1: Player Action Request
Client requests action, server validates and executes

\`\`\`lua
-- Client (LocalScript)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local damageEnemy = ReplicatedStorage:WaitForChild("DamageEnemy")

local function onEnemyClicked(enemy)
    damageEnemy:FireServer(enemy)
end

-- Server (Script)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local damageEnemy = ReplicatedStorage:WaitForChild("DamageEnemy")

damageEnemy.OnServerEvent:Connect(function(player, enemy)
    -- Validate: Is enemy valid? Is player in range?
    if enemy and enemy.Parent and isInRange(player, enemy) then
        enemy.Humanoid.Health -= 10
    end
end)
\`\`\`

### Pattern 2: Data Update
Server pushes data updates to clients

\`\`\`lua
-- Server
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local updateScore = ReplicatedStorage:WaitForChild("UpdateScore")

local function updatePlayerScore(player, score)
    player.leaderstats.Score.Value = score
    updateScore:FireClient(player, score)
end

-- Client
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local updateScore = ReplicatedStorage:WaitForChild("UpdateScore")

updateScore.OnClientEvent:Connect(function(newScore)
    -- Update UI
    scoreLabel.Text = tostring(newScore)
end)
\`\`\`

### Pattern 3: Client State Sync
Client reports state, server syncs to others

\`\`\`lua
-- Client
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local updateAnimation = ReplicatedStorage:WaitForChild("UpdateAnimation")

-- When local player changes animation
updateAnimation:FireServer("running")

-- Server
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local updateAnimation = ReplicatedStorage:WaitForChild("UpdateAnimation")

updateAnimation.OnServerEvent:Connect(function(player, animName)
    -- Broadcast to other players (not sender)
    for _, otherPlayer in game.Players:GetPlayers() do
        if otherPlayer ~= player then
            updateAnimation:FireClient(otherPlayer, player, animName)
        end
    end
end)
\`\`\`

## Security Best Practices

### 1. Never Trust Client Input
\`\`\`lua
-- BAD: Client sends damage amount directly
remoteEvent.OnServerEvent:Connect(function(player, enemy, damage)
    enemy.Humanoid.Health -= damage  -- Client can send any value!
end)

-- GOOD: Server validates and determines damage
remoteEvent.OnServerEvent:Connect(function(player, enemy)
    if isValidAttack(player, enemy) then
        enemy.Humanoid.Health -= calculateDamage(player)  -- Server calculates
    end
end)
\`\`\`

### 2. Validate Player Actions
\`\`\`lua
remoteEvent.OnServerEvent:Connect(function(player, target, action)
    -- Validate player can perform action
    if not player:IsInGroup(123456) then
        return  -- Not authorized
    end

    -- Validate target exists
    if not target or not target.Parent then
        return
    end

    -- Validate cooldown
    local lastAction = cooldowns[player.UserId]
    if lastAction and tick() - lastAction < COOLDOWN_TIME then
        return  -- Too soon
    end

    -- Perform action
    performAction(player, target, action)
    cooldowns[player.UserId] = tick()
end)
\`\`\`

### 3. Use ServerStorage for Sensitive Data
- Never store admin tools in ReplicatedStorage
- Keep exploit-sensitive logic on the server
- Use **ServerStorage** for server-only objects

## Performance Tips

### 1. Batch Updates
\`\`\`lua
-- Instead of firing for every small change:
remoteEvent:FireClient(player, score + 1)  -- Bad

-- Batch updates:
local score = 0
local function incrementScore()
    score += 1
end

local function syncScore()
    remoteEvent:FireClient(player, score)  -- Fire periodically
end
\`\`\`

### 2. Filter RemoteEvents
\`\`\`lua
-- Only send relevant data to each client
remoteEvent:FireClient(player, getRelevantData(player))

-- Instead of:
remoteEvent:FireAllClients(allData)  -- Wastes bandwidth
\`\`\`

### 3. Use Unreliable Remote Events for High-Frequency Data
\`\`\`lua
-- For position updates, input states, etc.
-- Data may be lost but stays current
local unreliableremoteEvent = ReplicatedStorage:WaitForChild("PositionUpdate")
unreliableremoteEvent:FireServer(position)
\`\`\`

## Directory Structure

\`\`\`
ReplicatedStorage/
├── Remotes/
│   ├── RemoteEvents/
│   │   ├── DamageEnemy
│   │   ├── UpdateScore
│   │   └── PlayerAction
│   └── RemoteFunctions/
│       ├── GetPlayerData
│       └── ValidatePurchase
└── SharedModules/
    └── SharedConstants
\`\`\`
`;

const COMMON_DATATYPES = `# Common Roblox DataTypes Reference

## Vector3

Represents a 3D position or direction with X, Y, Z components.

### Constructor
\`\`\`lua
local vec = Vector3.new(x, y, z)
local zero = Vector3.zero
local one = Vector3.one
\`\`\`

### Properties
\`\`\`lua
vec.X  -- X component
vec.Y  -- Y component
vec.Z  -- Z component
vec.Magnitude  -- Length of the vector
vec.Unit  -- Normalized vector (length = 1)
\`\`\`

### Common Operations
\`\`\`lua
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
\`\`\`

---

## CFrame (Coordinate Frame)

Represents position and rotation in 3D space.

### Constructor
\`\`\`lua
-- Position only
local cf = CFrame.new(0, 10, 0)

-- Position and look-at
local cf = CFrame.new(0, 10, 0, lookAtPos)

-- From components (position + rotation matrix)
local cf = CFrame.new(x, y, z, r00, r01, r02, r10, r11, r12, r20, r21, r22)

-- From angles (Euler angles)
local cf = CFrame.Angles(math.rad(x), math.rad(y), math.rad(z))
\`\`\`

### Properties
\`\`\`lua
cf.Position  -- Vector3 position
cf.LookVector  -- Vector3 forward direction
cf.UpVector  -- Vector3 up direction
cf.RightVector  -- Vector3 right direction
\`\`\`

### Common Operations
\`\`\`lua
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
\`\`\`

---

## UDim2

Used for GUI sizing and positioning with scale and offset.

### Constructor
\`\`\`lua
-- UDim2.new(scale.x, offset.x, scale.y, offset.y)
local udim2 = UDim2.new(0.5, 0, 0.5, 0)  -- Center position
local size = UDim2.new(1, 0, 1, 0)  -- Full size

-- Named constructors
local fromScale = UDim2.fromScale(0.5, 0.5)  -- Scale only
local fromOffset = UDim2.fromOffset(100, 50)  -- Offset only
\`\`\`

### Properties
\`\`\`lua
udim2.X.Scale  -- Horizontal scale (0-1 = 0%-100%)
udim2.X.Offset  -- Horizontal offset in pixels
udim2.Y.Scale  -- Vertical scale
udim2.Y.Offset  -- Vertical offset in pixels
\`\`\`

### Common Usage
\`\`\`lua
-- Responsive GUI (scales with screen)
frame.Size = UDim2.new(0.5, 0, 0.5, 0)

-- Fixed size (pixels)
frame.Size = UDim2.new(0, 200, 0, 100)

-- Hybrid (scales but with padding)
frame.Size = UDim2.new(1, -20, 1, -20)  -- Full size minus 20px padding

-- Center positioning
frame.Position = UDim2.new(0.5, -100, 0.5, -50)  -- Center with offset
frame.AnchorPoint = Vector2.new(0.5, 0.5)
\`\`\`

---

## Color3

Represents an RGB color.

### Constructor
\`\`\`lua
local color = Color3.new(r, g, b)  -- Values 0-1
local red = Color3.new(1, 0, 0)
local green = Color3.fromRGB(0, 255, 0)  -- 0-255
local blue = Color3.fromHex("#0000FF")
\`\`\`

### Properties
\`\`\`lua
color.R  -- Red component (0-1)
color.G  -- Green component (0-1)
color.B  -- Blue component (0-1)
\`\`\`

### Common Operations
\`\`\`lua
-- Predefined colors
local brickColor = BrickColor.new("Bright red")
local color = brickColor.Color

-- Color interpolation
local lerped = color1:Lerp(color2, alpha)

-- Convert to HSV
local hue, sat, val = color:ToHSV()

-- Convert from HSV
local fromHSV = Color3.fromHSV(hue, sat, val)
\`\`\`

---

## NumberRange

Represents a range between two numbers.

### Constructor
\`\`\`lua
local range = NumberRange.new(min, max)
local single = NumberRange.new(5)  -- min = max = 5
\`\`\`

### Properties
\`\`\`lua
range.Min  -- Minimum value
range.Max  -- Maximum value
\`\`\`

### Common Usage
\`\`\`lua
-- For randomized values
local damage = NumberRange.new(10, 20)
local actualDamage = math.random(damage.Min, damage.Max)
\`\`\`

---

## TweenInfo

Parameters for TweenService animations.

### Constructor
\`\`\`lua
local info = TweenInfo.new(
    duration,          -- Time in seconds
    easingStyle,       -- Enum.EasingStyle
    easingDirection,   -- Enum.EasingDirection
    repeatCount,       -- -1 for infinite
    reverses,          -- Boolean
    delayTime          -- Delay before start
)
\`\`\`

### Example
\`\`\`lua
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
\`\`\`
`;

const SERVICES_REFERENCE = `# Roblox Services Reference

## Common Services

### Players
Manages all players in the game.

\`\`\`lua
local Players = game:GetService("Players")

-- Events
Players.PlayerAdded:Connect(function(player)
    -- New player joined
end)

Players.PlayerRemoving:Connect(function(player)
    -- Player leaving
end)

-- Get local player (client only)
local player = Players.LocalPlayer

-- Get player by name
local player = Players:GetPlayerFromCharacter(character)

-- Get all players
for _, player in Players:GetPlayers() do
    print(player.Name)
end
\`\`\`

### ReplicatedStorage
Stores objects that replicate to both server and clients.

\`\`\`lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Common uses:
-- - RemoteEvents/RemoteFunctions
-- - Shared ModuleScripts
-- - Shared assets
\`\`\`

### ServerStorage
Server-only storage (does not replicate to clients).

\`\`\`lua
local ServerStorage = game:GetService("ServerStorage")

-- Common uses:
-- - Game maps
-- - Server-only configuration
-- - Enemy spawners
\`\`\`

### Workspace
The 3D game world where parts and models exist.

\`\`\`lua
local Workspace = workspace

-- Common properties
Workspace.Gravity  -- Default 196.2
Workspace.DistributedGameTime  -- Elapsed time
Workspace.CurrentCamera  -- The camera

-- Events
Workspace.ChildAdded:Connect(function(child)
    -- Something added to workspace
end)
\`\`\`

### Lighting
Controls visual appearance of the game.

\`\`\`lua
local Lighting = game:GetService("Lighting")

-- Properties
Lighting.ClockTime  -- 0-24 day cycle
Lighting.Brightness  -- Overall brightness
Lighting.EnvironmentDiffuseScale  -- Ambient lighting
Lighting.EnvironmentSpecularScale  -- Reflectivity

-- Time of day
Lighting.LightingEffect  -- Effects like "Atmosphere"

-- Color effects
local colorCorrection = Lighting:FindFirstChildOfClass("ColorCorrectionEffect")
if colorCorrection then
    colorCorrection.TintColor = Color3.fromRGB(255, 200, 200)
end
\`\`\`

### TweenService
Creates smooth property animations.

\`\`\`lua
local TweenService = game:GetService("TweenService")

local tweenInfo = TweenInfo.new(
    1,  -- Duration
    Enum.EasingStyle.Quad,
    Enum.EasingDirection.Out
)

local goals = {
    Position = Vector3.new(0, 10, 0),
    Size = Vector3.new(2, 2, 2)
}

local tween = TweenService:Create(part, tweenInfo, goals)

-- Control playback
tween:Play()
tween:Pause()
tween:Cancel()

-- Events
tween.Completed:Connect(function()
    print("Tween finished!")
end)
\`\`\`

### CollectionService
Manages objects with tags for organized game logic.

\`\`\`lua
local CollectionService = game:GetService("CollectionService")

-- Tag management
CollectionService:AddTag(instance, "MyTag")
CollectionService:RemoveTag(instance, "MyTag")
local hasTag = CollectionService:HasTag(instance, "MyTag")

-- Get tagged objects
for _, instance in CollectionService:GetTagged("MyTag") do
    print(instance.Name)
end

-- Events
CollectionService:GetInstanceAddedSignal("MyTag"):Connect(function(instance)
    -- Tag added to instance
end)

CollectionService:GetInstanceRemovedSignal("MyTag"):Connect(function(instance)
    -- Tag removed from instance
end)
\`\`\`

### RunService
Manages game loop and heartbeat.

\`\`\`lua
local RunService = game:GetService("RunService")

-- Heartbeat (runs every frame, ~60 times/sec)
RunService.Heartbeat:Connect(function(dt)
    -- dt is delta time in seconds
    updatePhysics(dt)
end)

-- RenderStepped (runs before frame render, client only)
RunService.RenderStepped:Connect(function(dt)
    updateCamera(dt)
end)

-- Stepped (runs after physics)
RunService.Stepped:Connect(function(time, dt)
    postPhysicsUpdate(time, dt)
end)

-- Check context
if RunService:IsClient() then
    print("Running on client")
elseif RunService:IsServer() then
    print("Running on server")
elseif RunService:IsStudio() then
    print("Running in Studio")
end
\`\`\`

### Debris
Automatically removes objects after a delay.

\`\`\`lua
local Debris = game:GetService("Debris")

-- Remove part after 5 seconds
Debris:AddItem(part, 5)

-- Useful for:
-- - Temporary projectiles
-- - Dead bodies
-- - Temporary effects
\`\`\`

### SoundService
Manages audio in the game.

\`\`\`lua
local SoundService = game:GetService("SoundService")

-- Volume control
SoundService.AmbientReverb = Enum.ReverbType.NoReverb
SoundService.DistanceFactor = 3.33  -- studs per meter

-- Sound groups (for volume control)
local musicGroup = SoundService:FindFirstChildOfClass("SoundGroup")
local sfxGroup = SoundService:FindFirstChildOfClass("SoundGroup")

-- Playing sounds
local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://1234567890"
sound.Parent = workspace
sound:Play()
\`\`\`

### UserInputService
Handles user input (client only).

\`\`\`lua
local UserInputService = game:GetService("UserInputService")

-- Input began
UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end

    if input.KeyCode == Enum.KeyCode.E then
        -- E key pressed
    elseif input.UserInputType == Enum.UserInputType.MouseButton1 then
        -- Left mouse clicked
    end
end)

-- Input ended
UserInputService.InputEnded:Connect(function(input, gameProcessed)
    -- Input released
end)

-- Touch/mouse position
local position = UserInputService:GetMouseLocation()
local isTouchDevice = UserInputService.TouchEnabled
\`\`\`

### GuiService
Manages GUI elements and menus.

\`\`\`lua
local GuiService = game:GetService("GuiService")

-- Check if GUI is open
local isMenuOpen = GuiService.MenuIsOpen

-- Show/hide GUI
GuiService:CloseGuis()

-- Get selection (for gamepad navigation)
local selected = GuiService.SelectedObject
\`\`\`

## Service Order

When using \`game:GetService()\`, services are retrieved in this order:

1. Services already in \`game\`
2. Services loaded from memory
3. Services loaded by name

This ensures consistent behavior and performance.
`;

export interface ResourceConfig {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export class ResourceRegistry {
  private resources: Map<string, { metadata: Resource; content: string }> = new Map();

  register(uri: string, metadata: Resource, content: string): void {
    this.resources.set(uri, { metadata, content });
  }

  unregister(uri: string): void {
    this.resources.delete(uri);
  }

  get(uri: string): { metadata: Resource; content: string } | undefined {
    return this.resources.get(uri);
  }

  has(uri: string): boolean {
    return this.resources.has(uri);
  }

  getAll(): { metadata: Resource; content: string }[] {
    return Array.from(this.resources.values());
  }

  getSchemas(): Resource[] {
    return this.getAll().map(r => r.metadata);
  }

  getContent(uri: string): string | undefined {
    return this.resources.get(uri)?.content;
  }
}

export function createRobloxResourceRegistry(): ResourceRegistry {
  const registry = new ResourceRegistry();

  // Register all resources
  registry.register(
    'roblox://docs/best-practices',
    {
      uri: 'roblox://docs/best-practices',
      name: 'best-practices',
      description: 'Roblox development best practices and common patterns',
      mimeType: 'text/markdown',
    },
    BEST_PRACTICES
  );

  registry.register(
    'roblox://docs/client-server-patterns',
    {
      uri: 'roblox://docs/client-server-patterns',
      name: 'client-server-patterns',
      description: 'Client-server communication patterns and security practices',
      mimeType: 'text/markdown',
    },
    CLIENT_SERVER_PATTERNS
  );

  registry.register(
    'roblox://docs/common-datatypes',
    {
      uri: 'roblox://docs/common-datatypes',
      name: 'common-datatypes',
      description: 'Reference for common Roblox DataTypes (Vector3, CFrame, UDim2, etc.)',
      mimeType: 'text/markdown',
    },
    COMMON_DATATYPES
  );

  registry.register(
    'roblox://docs/services-reference',
    {
      uri: 'roblox://docs/services-reference',
      name: 'services-reference',
      description: 'Reference for common Roblox services and their usage',
      mimeType: 'text/markdown',
    },
    SERVICES_REFERENCE
  );

  return registry;
}

export { createRobloxResourceRegistry as default };
