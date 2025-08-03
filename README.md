# Computer Graphics - Exercise 6 - Interactive Basketball Shooting Game with Physics

https://github.com/rudyops/graphics5-final-project.git

## Group Members
- **Nimrod Cohen**
- **Raz Atyia**

## How to Run the Implementation

### Prerequisites
- Node.js installed on your system
- Modern web browser with WebGL support

### Running the Application
1. Clone or download the repository
2. Navigate to the project directory
3. Install dependencies (if needed):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node index.js
   ```
5. Open your web browser and navigate to: `http://localhost:8000`

## Complete List of Implemented Controls

| Control | Function | Description |
|---------|----------|-------------|
| **Arrow Keys** | Move Basketball | Left/Right: Move ball horizontally across court<br>Up/Down: Move ball forward/backward on court |
| **W / S Keys** | Adjust Shot Power | W: Increase shot power (stronger shot)<br>S: Decrease shot power (weaker shot) |
| **Spacebar** | Shoot Basketball | Launch ball toward nearest hoop using current power level |
| **R Key** | Reset Basketball | Return ball to center court position and reset physics state |
| **O Key** | Toggle Camera | Enable/disable orbit camera controls (inherited from HW05) |

## Physics System Implementation

### Gravity and Trajectory
- Realistic gravity simulation with constant downward acceleration
- Parabolic trajectory calculations for basketball shots
- Initial velocity components based on shot angle and power
- Proper arc physics ensuring realistic basketball flight paths

### Collision Detection
- **Ground Collision**: Ball bounces when hitting the court surface
- **Rim Collision**: Detection for successful shots through the hoop
- **Energy Loss**: Coefficient of restitution applied on each bounce
- **Boundary Checking**: Ball stays within court boundaries during movement

### Shot Mechanics
- Adjustable shot power system (0-100%) affecting initial velocity
- Automatic shot angle calculation toward nearest hoop
- Minimum arc height requirements for successful shots
- Realistic ball physics during flight and landing

## Scoring System

### Score Detection
- Accurate detection when basketball passes through hoop area
- Successful shots require proper downward trajectory
- Each successful shot awards 2 points
- Real-time score updates

### Statistics Tracking
- **Total Score**: Points earned from successful shots
- **Shot Attempts**: Number of times spacebar was pressed
- **Shots Made**: Number of successful shots
- **Shooting Percentage**: (Shots Made / Shot Attempts) × 100%

### Visual Feedback
- "SHOT MADE!" message for successful shots
- "MISSED SHOT" message for unsuccessful attempts
- Live UI updates showing current statistics
- Shot power indicator display

## Basketball Animation Features
- Realistic ball rotation during movement and flight
- Rotation axis matches movement direction
- Rotation speed proportional to ball velocity
- Smooth rotation transitions and physics-based movement

## Additional Features Implemented
- **Enhanced Court Infrastructure**: Building upon HW05 with court texture, beam cushions, lights, projectors, benches, and viewer seating
- **Interactive UI**: Comprehensive display showing scores, statistics, shot power, and control instructions
- **Smooth Controls**: Responsive keyboard input handling with proper movement boundaries
- **Physics Integration**: Time-based physics calculations for consistent 60 FPS performance

## Known Issues or Limitations
- None currently identified - all required features are fully implemented and functional

## Sources of External Assets Used
- **Ball Texture**: https://polyhaven.com/
- **Court Texture**: https://freepbr.com/
- **Three.js Library**: https://threejs.org/
- **Physics Calculations**: Based on standard projectile motion physics principles
