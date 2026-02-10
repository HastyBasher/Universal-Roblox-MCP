# Client-Server Communication Patterns

## Overview

Roblox uses a **client-server model** where:
- **Server** - Authoritative game logic, runs on Roblox servers
- **Client** - Each player's local game, runs on their device

## Communication Methods

### RemoteEvents
Best for **one-way** communication (fire and forget)

```lua
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
```

```lua
-- LocalScript (client)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = ReplicatedStorage:WaitForChild("MyRemoteEvent")

-- Client fires to server
remoteEvent:FireServer(arg1, arg2)

-- Client listens for server
remoteEvent.OnClientEvent:Connect(function(arg1, arg2)
    -- Handle server message
end)
```

### RemoteFunctions
Best for **two-way** communication (request/response)

```lua
-- Server script
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteFunction = ReplicatedStorage:WaitForChild("MyRemoteFunction")

remoteFunction.OnServerInvoke = function(player, arg1)
    -- Process request and return result
    return "server response"
end
```

```lua
-- LocalScript (client)
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteFunction = ReplicatedStorage:WaitForChild("MyRemoteFunction")

local result = remoteFunction:InvokeServer(arg1)
print("Server responded:", result)
```

## Common Patterns

### Pattern 1: Player Action Request
Client requests action, server validates and executes

```lua
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
```

### Pattern 2: Data Update
Server pushes data updates to clients

```lua
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
```

### Pattern 3: Client State Sync
Client reports state, server syncs to others

```lua
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
```

## Security Best Practices

### 1. Never Trust Client Input
```lua
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
```

### 2. Validate Player Actions
```lua
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
```

### 3. Use ServerStorage for Sensitive Data
- Never store admin tools in ReplicatedStorage
- Keep exploit-sensitive logic on the server
- Use **ServerStorage** for server-only objects

## Performance Tips

### 1. Batch Updates
```lua
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
```

### 2. Filter RemoteEvents
```lua
-- Only send relevant data to each client
remoteEvent:FireClient(player, getRelevantData(player))

-- Instead of:
remoteEvent:FireAllClients(allData)  -- Wastes bandwidth
```

### 3. Use Unreliable Remote Events for High-Frequency Data
```lua
-- For position updates, input states, etc.
-- Data may be lost but stays current
local unreliableremoteEvent = ReplicatedStorage:WaitForChild("PositionUpdate")
unreliableremoteEvent:FireServer(position)
```

## Directory Structure

```
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
```
