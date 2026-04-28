import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle, Search, Filter, LayoutList, BarChart2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

// ─── SUITE NAV ────────────────────────────────────────────────────────────────
const SUITE_TOOLS = [
  { id: "doorspec",    label: "DoorSpec",    url: "https://doorspec-aadm.vercel.app" },
  { id: "battlecard", label: "BattleCard",  url: "https://battlecard-aadm.vercel.app" },
  { id: "codetracker",label: "CodeTracker", url: "https://codetracker-aadm.vercel.app" },
  { id: "crosswalkdb",label: "CrosswalkDB", url: "https://crosswalkdb-aadm.vercel.app" },
  { id: "pmstudio",   label: "PM Studio",   url: "https://pmstudio-aadm.vercel.app" },
  { id: "portfolioiq",label: "PortfolioIQ", url: "https://portfolioiq-aadm.vercel.app" },
  { id: "iptracker",  label: "IP Tracker",  url: "https://iptracker-aadm.vercel.app" },
] as const;

function SuiteNav() {
  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-700/60 px-4 py-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mr-2 shrink-0">PM Suite</span>
      {SUITE_TOOLS.map((tool) => {
        const isActive = tool.id === "iptracker";
        return (
          <button
            key={tool.id}
            onClick={() => !isActive && window.open(tool.url, "_blank")}
            className={`shrink-0 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-primary text-white cursor-default"
                : "text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 cursor-pointer"
            }`}
          >
            {tool.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
type PatentStatus = "active" | "expired" | "expiring_soon";
type PatentSide = "ours" | "competitor";

interface Patent {
  id: string;
  side: PatentSide;
  company: string;
  patent_number: string;
  title: string;
  category: string;
  filed_date: string | null;
  grant_date: string | null;
  expiry_date: string | null;
  description: string;
  status: PatentStatus | "N/A";
}

const OUR_PATENTS: Patent[] = [
  // ASSA ABLOY Entrance Systems AB
  { id:"aa1", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12359494", title:"Automatic Door with Hinged Swinging Partial Door", category:"Sliding Door", filed_date:"2023-07-28", grant_date:"2025-07-15", expiry_date:"2045-07-15", description:"Combines a sliding door panel with an integrated hinged swinging partial door section — standard automatic slider plus a manual swing section for low-traffic periods.", status:"active" },
  { id:"aa2", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12252924", title:"Belt Tensioning System for Sliding Door Belt Drive", category:"Sliding Door", filed_date:"2021-06-03", grant_date:"2025-03-18", expiry_date:"2045-03-18", description:"Maintains optimal belt tension across temperature changes and wear for reliable, low-noise sliding door operation.", status:"active" },
  { id:"aa3", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12227982", title:"Egress Entrance System with Swing Door Member", category:"Swing Door", filed_date:"2020-09-09", grant_date:"2025-02-18", expiry_date:"2045-02-18", description:"Integrates swing door egress compliance into automatic door systems with normal automatic operation and emergency exit functionality.", status:"active" },
  { id:"aa4", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12221822", title:"Door Operation Management System with Movement Sensors", category:"Sensors", filed_date:"2020-06-09", grant_date:"2025-02-11", expiry_date:"2045-02-11", description:"Tracks and analyzes pedestrian traffic patterns to optimize door timing, energy consumption, and predictive maintenance.", status:"active" },
  { id:"aa5", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12180768", title:"Revolving Door Assembly with Central Column Drive", category:"Revolving Door", filed_date:"2021-03-04", grant_date:"2024-12-31", expiry_date:"2044-12-31", description:"Central column houses drive mechanism, sensors, and control electronics in a clean architectural design with simplified maintenance access.", status:"active" },
  { id:"aa6", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12129706", title:"Control Arrangement for Entrance System", category:"Access Control", filed_date:"2022-04-22", grant_date:"2024-10-29", expiry_date:"2044-10-29", description:"Integrates access control credentials (cards, fobs, biometrics) with automatic door operation in a unified system architecture.", status:"active" },
  { id:"aa7", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12054978", title:"Swing Door Entrance System with Emergency Mode", category:"Swing Door", filed_date:"2020-06-09", grant_date:"2024-08-06", expiry_date:"2044-08-06", description:"Maintains operability on battery backup or manual mode when main power fails — ensures egress compliance and fire safety.", status:"active" },
  { id:"aa8", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12031372", title:"Sliding Door Assembly", category:"Sliding Door", filed_date:"2020-05-14", grant_date:"2024-07-09", expiry_date:"2044-07-09", description:"Improved structural integration between drive unit, door panel suspension, and guide system for easier installation and maintenance.", status:"active" },
  { id:"aa9", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12012795", title:"Swing Door Operator with Object-Identifying Sensor", category:"Sensors", filed_date:"2020-04-29", grant_date:"2024-06-18", expiry_date:"2044-06-18", description:"Primary sensor identifies objects in the door's sweep path and adjusts opening speed, hold-open time, and closing behavior accordingly.", status:"active" },
  { id:"aa10", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US10294710", title:"Modular Revolving Door with Bottom-Mounted Drive Base", category:"Revolving Door", filed_date:"2015-03-25", grant_date:"2019-05-21", expiry_date:"2039-05-21", description:"Low-profile floor-mounted housing contains motor, gearbox, and controls. Modular design enables field assembly, easier maintenance, and size adaptation.", status:"active" },
  { id:"aa11", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12039816", title:"One-Way Pass-Through System with Return Block", category:"Access Control", filed_date:"2019-12-09", grant_date:"2024-07-16", expiry_date:"2044-07-16", description:"One-way passage system with entrance/exit doors and sensor device that detects persons and triggers safety mode for back movement.", status:"active" },
  { id:"aa12", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11946307", title:"Control Arrangement with Sensor Power Management", category:"Sensors", filed_date:"2022-04-22", grant_date:"2024-04-02", expiry_date:"2044-04-02", description:"Selectively places sensors in active or inactive (zero-power) modes based on current entrance operational state — major energy savings.", status:"active" },
  // ── NEW PATENTS (2023–2026 grants) ──
{ id:"aa_n1", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12592111", title:"One-way pass-through system with return block for use in buildings", category:"Access Control", filed_date:"2024-06-07", grant_date:"2026-03-31", expiry_date:"2044-06-07", description:"A one-way passage system with entrance and exit door arrangements separated by side walls; a sensor device detects persons in the passage area and triggers a safety mode to close the entrance door if someone attempts to go back. Color-coded illumination in the passage area signals different operating modes to users.", status:"active" },
  { id:"aa_n2", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12579857", title:"Method for operating a person separation device as well as person separation device", category:"Access Control", filed_date:"2022-08-03", grant_date:"2026-03-17", expiry_date:"2042-08-03", description:"A camera-based system tracks individuals through a security clearing zone; the door controller opens or closes based on each person\'s clearance status and a dynamic security zone whose shape adapts to the movement speed and direction of uncleared persons.", status:"active" },
  { id:"aa_n3", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12577832", title:"Door operation system", category:"Automatic Door", filed_date:"2021-03-11", grant_date:"2026-03-17", expiry_date:"2041-03-11", description:"A roller-shutter style door system where a flexible protective barrier rolls between open and closed states along spiral or curved tracks. Omega-drive transmission elements mesh with track-mounted elements to move the barrier along the curved track sections.", status:"active" },
  { id:"aa_n4", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12572147", title:"Vehicle guidance systems and associated methods of use at logistics yards and other locations", category:"Automatic Door", filed_date:"2023-12-20", grant_date:"2026-03-10", expiry_date:"2043-12-20", description:"An autonomous yard tractor system locates trailers in a distribution center yard, docks them at loading stations and returns them to parking using automated guidance. Sensor systems detect trailer position relative to both tractor and dock during docking procedures.", status:"active" },
  { id:"aa_n5", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12570129", title:"Loading dock automated trailer door systems", category:"Industrial / Loading Dock", filed_date:"2022-05-31", grant_date:"2026-03-10", expiry_date:"2042-05-31", description:"An externally driven system for opening and closing trailer doors at loading docks; a counterbalance shaft and torsion drive member allow external rotation of the door via an accessible engagement portion, with a motorized winder to automate the operation.", status:"active" },
  { id:"aa_n6", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12503324", title:"Vehicle restraint", category:"Industrial / Loading Dock", filed_date:"2023-01-27", grant_date:"2025-12-23", expiry_date:"2043-01-27", description:"A restraining assembly for a loading dock vehicle restraint with a rotating hook mechanism that self-adjusts to the height of a trailer\'s RIG bar. The hook transitions between a receiving position and a locking position only through contact with the RIG bar, eliminating manual operation.", status:"active" },
  { id:"aa_n7", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12499716", title:"System and method for controlling the operation of a door", category:"Automatic Door", filed_date:"2020-06-17", grant_date:"2025-12-16", expiry_date:"2040-06-17", description:"A door control system that measures air pressure differential between inside and outside of a door and generates a control signal to adjust door operation when the pressure difference exceeds a predefined threshold—preventing door opening against high air pressure forces.", status:"active" },
  { id:"aa_n8", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12454426", title:"Control systems for operation of loading dock equipment, and associated methods of manufacture and use", category:"Industrial / Loading Dock", filed_date:"2024-02-05", grant_date:"2025-10-28", expiry_date:"2044-02-05", description:"A sequential control system for loading dock equipment (vehicle restraints, dock doors, dock levelers) that guides operators through a preset workflow using a display that presents control elements in correct procedural order. Authorization levels can enable or disable specific control panel functions.", status:"active" },
  { id:"aa_n9", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12444979", title:"Door operator system with wireless charging capability", category:"Automatic Door", filed_date:"2020-05-12", grant_date:"2025-10-14", expiry_date:"2040-05-12", description:"A door operator system where the drive unit is mounted on the door leaf itself and powered by an onboard energy storage device; an energy transmitting device fixed near the door wirelessly charges the energy storage device via an energy receiving device mounted on the moving door.", status:"active" },
  { id:"aa_n10", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12442235", title:"Revolving door", category:"Revolving Door", filed_date:"2021-03-18", grant_date:"2025-10-14", expiry_date:"2041-03-18", description:"A revolving door assembly with integrated lifting means in both the base and upper portions to facilitate installation and maintenance; the rotating assembly extends between base and upper portions and supports door panels rotating around the central axis.", status:"active" },
  { id:"aa_n11", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12428897", title:"Sectional door operator system", category:"Industrial / Loading Dock", filed_date:"2021-02-04", grant_date:"2025-09-30", expiry_date:"2041-02-04", description:"A sectional door operator with first and second drive units mounted on opposite sides of a door section; a sensor device monitors the door angle relative to horizontal and the control unit adjusts operation based on these angle measurements for precise positioning.", status:"active" },
  { id:"aa_n12", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12421782", title:"Testing system for swing door-based entrance system", category:"Swing Door", filed_date:"2020-09-09", grant_date:"2025-09-23", expiry_date:"2040-09-09", description:"An automatic swing door operator with a built-in testing mode that automatically determines test parameters and triggers actions in response—enabling self-diagnosis and performance verification without manual intervention.", status:"active" },
  { id:"aa_n13", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12416191", title:"Automatic door assembly having a sensor device, and method for operating an automatic door assembly of this kind", category:"Sensors", filed_date:"2022-05-27", grant_date:"2025-09-16", expiry_date:"2042-05-27", description:"An automatic door system with a first area-scan camera and a separate information-generating device; the control system performs detailed image analysis of the detection area combined with additional sensor information to determine safe door movement conditions.", status:"active" },
  { id:"aa_n14", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12400175", title:"Trailer validation systems", category:"Industrial / Loading Dock", filed_date:"2022-11-29", grant_date:"2025-08-26", expiry_date:"2042-11-29", description:"A trailer validation system that verifies a trailer is at the correct loading dock station; a display positioned at the dock shows trailer identity information readable by a device on the trailer, enabling trailers to identify and confirm their assigned dock.", status:"active" },
  { id:"aa_n15", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12258801", title:"Offset roller carrier and bottom bracket assembly", category:"Industrial / Loading Dock", filed_date:"2021-07-01", grant_date:"2025-03-25", expiry_date:"2041-07-01", description:"A bottom bracket assembly for sectional doors with an adjustable roller carrier that allows positioning of the roller wheel outward from the door edge—preventing interference between lift brackets and door tracks during operation.", status:"active" },
  { id:"aa_n16", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12240716", title:"Wiper seal pad systems", category:"Industrial / Loading Dock", filed_date:"2022-08-17", grant_date:"2025-03-04", expiry_date:"2042-08-17", description:"Wiper seal pad systems for loading dock stations consisting of an elongate pad that contacts trailer exterior surfaces; a hanger bracket with base, upward flange, and downward tab attaches the seal pad to the dock head member for weather sealing.", status:"active" },
  { id:"aa_n17", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12234111", title:"Systems and methods for automated loading and unloading at a dock station", category:"Industrial / Loading Dock", filed_date:"2021-09-14", grant_date:"2025-02-25", expiry_date:"2041-09-14", description:"An autonomous dock station system integrating an automated material lift truck (AMT) with a pallet conveyor and facility guidance system; the AMT automatically loads/unloads trailers following a workflow that transitions from fixed facility guidance to trailer-internal guidance at the trailer entrance.", status:"active" },
  { id:"aa_n18", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12232693", title:"Systems and methods for automatically controlling loading dock equipment", category:"Industrial / Loading Dock", filed_date:"2022-05-13", grant_date:"2025-02-25", expiry_date:"2042-05-13", description:"Automated loading dock system with scanning devices that assist trailer alignment at the docking station and check for obstructions inside the dock door area; transmits status messages between system components and users throughout the docking process.", status:"active" },
  { id:"aa_n19", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12221831", title:"High performance door", category:"Industrial / Loading Dock", filed_date:"2020-06-17", grant_date:"2025-02-11", expiry_date:"2040-06-17", description:"A high-speed flexible curtain door where the rigid bottom beam is shaped with at least one flush side aligned with the curtain surface, minimizing the risk of the bottom beam contacting surrounding objects during opening.", status:"active" },
  { id:"aa_n20", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12221301", title:"Remote loading dock authorization systems and methods", category:"Industrial / Loading Dock", filed_date:"2023-10-20", grant_date:"2025-02-11", expiry_date:"2043-10-20", description:"A remote monitoring and authorization system for loading dock stations that provides real-time status information on dock components to a remote supervisor; the supervisor can grant or deny override requests from dock operators based on live component status and workflow data.", status:"active" },
  { id:"aa_n21", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12139944", title:"Corner bracket", category:"Industrial / Loading Dock", filed_date:"2020-11-17", grant_date:"2024-11-12", expiry_date:"2040-11-17", description:"A corner bracket for vertically moving sectional doors containing a guide path for the lift cable and an integrated switch that is actuated by the lift cable in the event of cable breakage—automatically stopping the door to prevent unsafe operation.", status:"active" },
  { id:"aa_n22", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12098584", title:"Door operator system", category:"Automatic Door", filed_date:"2020-12-15", grant_date:"2024-09-24", expiry_date:"2040-12-15", description:"An overhead door operator where the drive unit and motor are mounted on the moving door itself; a driven transmission member on the door engages with an elongated fixed transmission member running along the frame side to propel the door up and down.", status:"active" },
  { id:"aa_n23", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12091896", title:"Method of arranging an overhead sectional door", category:"Industrial / Loading Dock", filed_date:"2021-01-21", grant_date:"2024-09-17", expiry_date:"2041-01-21", description:"An installation method for sectional overhead doors that uses the drive motor to assist stacking of door panel sections during assembly—the motor lifts previously fitted sections to create space for inserting each new section, reducing manual lifting effort.", status:"active" },
  { id:"aa_n24", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12031371", title:"Swing door operator", category:"Swing Door", filed_date:"2020-06-04", grant_date:"2024-07-09", expiry_date:"2040-06-04", description:"A swing door operator that moves a door leaf between first and second positions; includes a drive unit connected to the door leaf through a mechanism and a control system for managing door movement speed and position control.", status:"active" },
  { id:"aa_n25", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12012794", title:"Method, swing door system and swing door operator", category:"Swing Door", filed_date:"2020-04-29", grant_date:"2024-06-18", expiry_date:"2040-04-29", description:"A swing door operator with a sensor that identifies objects in a two-volume safety zone in front of the door leaf; the first and second volumes allow graduated responses—stopping or slowing the door depending on which zone the detected object occupies.", status:"active" },
  { id:"aa_n26", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12006760", title:"Automatic door with biased open and manually closed external partial door", category:"Sliding Door", filed_date:"2022-09-29", grant_date:"2024-06-11", expiry_date:"2042-09-29", description:"An automatic sliding door assembly incorporating partial hinged door panels on sidelites in a plane opposite to the sliding panels; the partial panels can swing outward for walk-through access while the sliding panels remain in a parallel plane in both open and closed positions.", status:"active" },
  { id:"aa_n27", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12006761", title:"Panel frame", category:"Sliding Door", filed_date:"2021-03-18", grant_date:"2024-06-11", expiry_date:"2041-03-18", description:"A door panel frame with two interlocking profiles; the first profile has a magnetic portion allowing a magnetic clamping member to temporarily hold the panel during assembly without permanent fasteners.", status:"active" },
  { id:"aa_n28", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12006754", title:"Method for testing of a door operator", category:"Automatic Door", filed_date:"2020-06-04", grant_date:"2024-06-11", expiry_date:"2040-06-04", description:"A test method for door operators that initiates a simulated powerless mode, measures door leaf movement via sensor during the simulation, and compares measured values against reference values to verify proper operation.", status:"active" },
  { id:"aa_n29", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12000197", title:"Automatic door operator with standby power switching", category:"Automatic Door", filed_date:"2020-03-27", grant_date:"2024-06-04", expiry_date:"2040-03-27", description:"An automatic door operator with a standby power switching circuit between the DC supply and main control circuit; the switching circuit cuts power after a preset period following receipt of a switching signal, reducing energy consumption and extending control circuit lifetime.", status:"active" },
  { id:"aa_n30", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US12000194", title:"Door operator for overhead door system with dual motor planetary gearing", category:"Automatic Door", filed_date:"2020-01-28", grant_date:"2024-06-04", expiry_date:"2040-01-28", description:"An overhead door operator with two electric motors connected to separate input shafts of a planetary gearing system; the shared planetary output shaft drives door movement, providing redundant power and enabling variable speed/torque control.", status:"active" },
  { id:"aa_n31", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11946306", title:"Automatic door operator with lead screw and rack-gear transmission", category:"Automatic Door", filed_date:"2020-03-27", grant_date:"2024-04-02", expiry_date:"2040-03-27", description:"An automatic door operator using a lead screw and nut to drive a slider with a rack portion; the rack engages an output shaft gear to produce rotational output, with the overlap length between rack and lead screw varying during movement for compact design.", status:"active" },
  { id:"aa_n32", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11939808", title:"Automatic door operator drive mechanism with planetary reducer", category:"Automatic Door", filed_date:"2020-03-27", grant_date:"2024-03-26", expiry_date:"2040-03-27", description:"An automatic door operator drive mechanism using a planetary reducer where the final-stage planet carrier has a torque output hole; a drive shaft is detachably inserted non-rotatably into this hole, enabling miniaturized design and easy shaft replacement.", status:"active" },
  { id:"aa_n33", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11933097", title:"Automatic door operator with sensor monitoring", category:"Automatic Door", filed_date:"2019-12-17", grant_date:"2024-03-19", expiry_date:"2039-12-17", description:"An automatic door operator with a sensor that monitors door leaf operation and transfers sensor data to a controller; the controller uses this operational data to adjust drive unit behavior and maintain optimal door performance over time.", status:"active" },
  { id:"aa_n34", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11926497", title:"Control systems for operation of loading dock equipment", category:"Industrial / Loading Dock", filed_date:"2022-03-14", grant_date:"2024-03-12", expiry_date:"2042-03-14", description:"A sequential loading dock control system that displays graphical control elements in a sequence reflecting the required workflow; visual appearance and presentation order guide the operator through correct sub-sequences, with authorization-level based enabling/disabling of functions.", status:"active" },
  { id:"aa_n35", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11920402", title:"Control systems for operation of loading dock equipment (graphical UI)", category:"Industrial / Loading Dock", filed_date:"2021-12-09", grant_date:"2024-03-05", expiry_date:"2041-12-09", description:"A touch-screen loading dock control system presenting a preset sequence of graphical control elements; the visual appearance and sequence of graphical buttons indicate the correct operational order to reduce user errors during dock equipment operation.", status:"active" },
  { id:"aa_n36", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11892853", title:"Vehicle guidance systems for logistics yards", category:"Automatic Door", filed_date:"2022-01-13", grant_date:"2024-02-06", expiry_date:"2042-01-13", description:"An autonomous yard tractor system that locates and moves trailers between parking positions and loading docks in distribution center yards; includes workflow procedures managed by a central control system for complete trailer lifecycle management.", status:"active" },
  { id:"aa_n37", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11859431", title:"Entrance system with swing door and door angle sensor", category:"Swing Door", filed_date:"2020-04-22", grant_date:"2024-01-02", expiry_date:"2040-04-22", description:"A swing door entrance system with a door-mounted angle sensor; in learn mode the controller builds a linkage reduction curve mapping door position to required torque across the swing range, then uses this curve in operational mode for precise and energy-efficient door control.", status:"active" },
  { id:"aa_n38", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11851928", title:"Revolving door mounting arrangement", category:"Revolving Door", filed_date:"2021-02-18", grant_date:"2023-12-26", expiry_date:"2041-02-18", description:"A mounting arrangement for a revolving door drive ring using pivotable hook elements on the wall element; the drive ring\'s connecting parts displace the hooks during mounting and then rest on them when fully mounted, allowing tool-free installation.", status:"active" },
  { id:"aa_n39", side:"ours", company:"ASSA ABLOY Entrance Systems", patent_number:"US11827468", title:"Remote loading dock authorization systems and methods (original)", category:"Industrial / Loading Dock", filed_date:"2022-12-06", grant_date:"2023-11-28", expiry_date:"2042-12-06", description:"An initial version of the remote monitoring and authorization system for loading docks; provides real-time dock component status to a remote supervisor who can review workflow progress and grant or deny operator override requests.", status:"active" },
];

const COMPETITOR_PATENTS: Patent[] = [
  // dormakaba
  { id:"dk1", side:"competitor", company:"dormakaba", patent_number:"US12234679", title:"Direct Swing Leaf Actuator", category:"Swing Door", filed_date:"2021-04-20", grant_date:"2025-02-25", expiry_date:"2045-02-25", description:"Direct-drive actuator for swing door leaves — compact motorized operator without gear reduction intermediaries.", status:"active" },
  { id:"dk2", side:"competitor", company:"dormakaba", patent_number:"US12188289", title:"Sensor-Based Multi-Person Detection Door Actuator", category:"Sensors", filed_date:"2022-02-09", grant_date:"2025-01-07", expiry_date:"2045-01-07", description:"Detects multiple persons simultaneously to intelligently control door open/close timing and hold-open duration.", status:"active" },
  { id:"dk3", side:"competitor", company:"dormakaba", patent_number:"US12123245", title:"Door System Operation with Adaptive Sensor Unit", category:"Sensors", filed_date:"2022-02-09", grant_date:"2024-10-22", expiry_date:"2044-10-22", description:"Sensor unit monitors door movement and environmental conditions to adapt automatic door behavior dynamically.", status:"active" },
  { id:"dk4", side:"competitor", company:"dormakaba", patent_number:"US12060744", title:"Mobile Device Configuration for Automatic Door", category:"Access Control", filed_date:"2021-06-08", grant_date:"2024-08-13", expiry_date:"2044-08-13", description:"Individual configuration of automatic door functions via mobile app — timing, hold-open duration, sensitivity — communicating wirelessly.", status:"active" },
  { id:"dk5", side:"competitor", company:"dormakaba", patent_number:"US12060742", title:"Radar/Camera-Based Automatic Door Control", category:"Sensors", filed_date:"2022-02-09", grant_date:"2024-08-13", expiry_date:"2044-08-13", description:"Uses radar sensor or camera-based detection to identify approaching persons and vehicles for context-aware door control.", status:"active" },
  { id:"dk6", side:"competitor", company:"dormakaba", patent_number:"US11939809", title:"Method for Operating a Door System", category:"Automatic Door", filed_date:"2022-02-09", grant_date:"2024-03-26", expiry_date:"2044-03-26", description:"Coordinates sensor input, motor control, and safety monitoring to ensure reliable and safe automatic door operation.", status:"active" },
  // Horton / Overhead Door (historical)
  { id:"ho1", side:"competitor", company:"Horton Automatics", patent_number:"US5221239", title:"Auto Door Operator — Compound Epicyclic Gear Drive", category:"Swing Door", filed_date:"1992-01-21", grant_date:"1993-06-22", expiry_date:"2013-06-22", description:"Compound epicyclic (planetary) gear drive system for smooth, high-torque operation of heavy-duty automatic swing doors. Now in public domain.", status:"expired" },
  { id:"ho2", side:"competitor", company:"Horton Automatics", patent_number:"US4333270", title:"Automatic Door Operator (Foundational)", category:"Automatic Door", filed_date:"1980-06-01", grant_date:"1982-06-08", expiry_date:"2002-06-08", description:"Foundational automatic door operator mechanism — motorized automatic opening and closing for pedestrian entrances. Now in public domain.", status:"expired" },
  // Stanley
  { id:"st1", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US6751909", title:"Auto Door Control System with Fail-Safe Motor Control", category:"Automatic Door", filed_date:"2002-02-01", grant_date:"2004-06-22", expiry_date:"2024-06-22", description:"Fail-safe motor control ensures door reaches safe state on power failure or fault. Now in public domain.", status:"expired" },
  { id:"st2", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US5142152", title:"Sliding Door Sensor — IR Approach & Threshold Detection", category:"Sensors", filed_date:"1991-01-02", grant_date:"1992-08-25", expiry_date:"2012-08-25", description:"Combined infrared approach and threshold presence detection in a single sensor unit. Now in public domain.", status:"expired" },
  { id:"st3", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US4823010", title:"Sliding Door Threshold Sensor", category:"Sensors", filed_date:"1987-05-11", grant_date:"1989-04-18", expiry_date:"2009-04-18", description:"Detects persons in the door threshold area to prevent closure. Now in public domain.", status:"expired" },
  { id:"st4", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US4967083", title:"Door Sensor System — Presence and Motion Combined", category:"Sensors", filed_date:"1989-04-14", grant_date:"1990-10-30", expiry_date:"2010-10-30", description:"Combines presence and motion detection for comprehensive automatic door control. Now in public domain.", status:"expired" },
  // Nabtesco
  { id:"nb1", side:"competitor", company:"Nabco Entrances", patent_number:"US5583405", title:"Ultrasonic Detection with Speed/Direction Prediction", category:"Sensors", filed_date:"1995-08-10", grant_date:"1996-12-10", expiry_date:"2016-12-10", description:"Predicts pedestrian speed and direction to proactively open the door before arrival. Now in public domain.", status:"expired" },
  { id:"nb2", side:"competitor", company:"Nabco Entrances", patent_number:"US4599824", title:"Device for Automatically Opening/Closing a Hinged Door", category:"Swing Door", filed_date:"1985-05-07", grant_date:"1986-07-15", expiry_date:"2006-07-15", description:"Electromechanical device for automatic swing door operation — foundational technology. Now in public domain.", status:"expired" },
  // GEZE
  { id:"gz1", side:"competitor", company:"GEZE GmbH", patent_number:"US11563390", title:"Braking Device — Generator-Based Energy Recovery", category:"Automatic Door", filed_date:"2019-01-08", grant_date:"2023-01-24", expiry_date:"2043-01-24", description:"Converts kinetic energy into electrical energy during door movement, providing controlled braking while recovering energy.", status:"active" },
  { id:"gz2", side:"competitor", company:"GEZE GmbH", patent_number:"US11512516", title:"Braking Device with Continuously Variable Transmission", category:"Automatic Door", filed_date:"2019-01-02", grant_date:"2022-11-29", expiry_date:"2042-11-29", description:"CVT mechanism provides smooth, steplessly adjustable braking force throughout the door's range of motion.", status:"active" },
  { id:"gz3", side:"competitor", company:"GEZE GmbH", patent_number:"US11384587", title:"User Interface Unit for Automatic Door Drive", category:"Automatic Door", filed_date:"2020-06-23", grant_date:"2022-07-12", expiry_date:"2042-07-12", description:"Touchscreen-based interface for configuration, monitoring, and diagnostics of automatic door operators.", status:"active" },
  { id:"gz4", side:"competitor", company:"GEZE GmbH", patent_number:"US11105136", title:"Hydraulic Door Drive Regulating Valve with Strike Function", category:"Swing Door", filed_date:"2019-06-24", grant_date:"2021-08-31", expiry_date:"2041-08-31", description:"Controlled deceleration as the door approaches fully open or closed — prevents door slamming.", status:"active" },
  { id:"gz5", side:"competitor", company:"GEZE GmbH", patent_number:"US11085219", title:"Door Drive — Motor as Generator", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2021-08-10", expiry_date:"2041-08-10", description:"Motor operates as generator during closing, harvesting kinetic energy to power control electronics — enables self-powered operation.", status:"active" },
  { id:"gz6", side:"competitor", company:"GEZE GmbH", patent_number:"US10995533", title:"Hydraulic Drive for Door/Window Sash", category:"Automatic Door", filed_date:"2019-06-20", grant_date:"2021-05-04", expiry_date:"2041-05-04", description:"Precision hydraulic flow regulation for controlled, smooth movement with adjustable closing and latch speed.", status:"active" },
  { id:"gz7", side:"competitor", company:"GEZE GmbH", patent_number:"US10961767", title:"System for Fixing and Emergency Opening of Door Leaf", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2021-03-30", expiry_date:"2041-03-30", description:"Holds door in fixed position normally; enables rapid emergency release in fire or egress situations.", status:"active" },
  { id:"gz8", side:"competitor", company:"GEZE GmbH", patent_number:"US10876346", title:"Braking Device with Sleep Mode Control", category:"Automatic Door", filed_date:"2019-01-07", grant_date:"2020-12-29", expiry_date:"2040-12-29", description:"Reduces power consumption when door hasn't operated for a set period — improves energy efficiency.", status:"active" },
  { id:"gz9", side:"competitor", company:"GEZE GmbH", patent_number:"US10851574", title:"Braking Device with FET Short Circuit Braking", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-12-01", expiry_date:"2040-12-01", description:"FET short circuit creates controlled electromagnetic braking force proportional to door speed.", status:"active" },
  { id:"gz10", side:"competitor", company:"GEZE GmbH", patent_number:"US10837212", title:"Drive Unit — Target Path Curve Closing", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-11-17", expiry_date:"2040-11-17", description:"Pre-programmed target path curve for smooth, consistent closing performance regardless of door weight or environment.", status:"active" },
  { id:"gz11", side:"competitor", company:"GEZE GmbH", patent_number:"US10808445", title:"Braking Device with Charging Circuit", category:"Automatic Door", filed_date:"2017-02-01", grant_date:"2020-10-20", expiry_date:"2040-10-20", description:"Integrated charging circuit harvests door movement energy to maintain capacitor/battery — enables operation without external power.", status:"active" },
  { id:"gz12", side:"competitor", company:"GEZE GmbH", patent_number:"US10781620", title:"Safety Function Monitoring for Door Closer", category:"Automatic Door", filed_date:"2017-10-27", grant_date:"2020-09-22", expiry_date:"2040-09-22", description:"Continuously tracks closing speed, latching, and hold-open parameters — generates alerts when outside safe range.", status:"active" },
  { id:"gz13", side:"competitor", company:"GEZE GmbH", patent_number:"US10767410", title:"Braking Device with Overload Protection", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-09-08", expiry_date:"2040-09-08", description:"Limits maximum braking torque to protect door hardware from damage under extreme impact or forced-entry.", status:"active" },
  { id:"gz14", side:"competitor", company:"GEZE GmbH", patent_number:"US10633901", title:"Braking Device with Current Sensor Safety", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-04-28", expiry_date:"2040-04-28", description:"Current sensors monitor motor/generator for obstruction or entrapment — triggers emergency stop protocols.", status:"active" },
  { id:"gz15", side:"competitor", company:"GEZE GmbH", patent_number:"US10626655", title:"Braking Device with Emergency Brake Circuit", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-04-21", expiry_date:"2040-04-21", description:"Integrated emergency brake circuit rapidly decelerates door from any speed to a stop.", status:"active" },
  { id:"gz16", side:"competitor", company:"GEZE GmbH", patent_number:"US10626653", title:"Door Closer Commissioning — Teach-In Procedure", category:"Automatic Door", filed_date:"2018-02-06", grant_date:"2020-04-21", expiry_date:"2040-04-21", description:"Automatically measures door parameters (mass, friction, spring force) during commissioning and self-calibrates control parameters.", status:"active" },
  { id:"gz17", side:"competitor", company:"GEZE GmbH", patent_number:"US10487561", title:"Sliding Arm Energy Conversion Mechanism", category:"Automatic Door", filed_date:"2017-06-14", grant_date:"2019-11-26", expiry_date:"2039-11-26", description:"Sliding arm converts door kinetic energy into electrical energy, providing both controlled damping and energy harvesting.", status:"active" },
  { id:"gz18", side:"competitor", company:"GEZE GmbH", patent_number:"US10316567", title:"Door Wing Drive with Energy Conversion Piston", category:"Automatic Door", filed_date:"2017-06-14", grant_date:"2019-06-11", expiry_date:"2039-06-11", description:"Energy-converting piston harnesses hydraulic pressure generated by door movement to power drive electronics.", status:"active" },
  { id:"gz19", side:"competitor", company:"GEZE GmbH", patent_number:"US10273736", title:"Braking Mechanism with PWM Control", category:"Automatic Door", filed_date:"2017-06-14", grant_date:"2019-04-30", expiry_date:"2039-04-30", description:"PWM precisely controls braking force by modulating generator/motor current — smooth and programmable deceleration.", status:"active" },
  { id:"gz20", side:"competitor", company:"GEZE GmbH", patent_number:"US10260270", title:"Sliding Rail Energy System Mechanism", category:"Automatic Door", filed_date:"2017-06-14", grant_date:"2019-04-16", expiry_date:"2039-04-16", description:"Rail-mounted energy recovery system controls door speed and provides self-powering capability.", status:"active" },
  // Nabco Entrances
  { id:"ne1", side:"competitor", company:"Nabco Entrances", patent_number:"US7451802", title:"Slidable Door with Auto Pivot Latch for Emergency Rooms", category:"Sliding Door", filed_date:"2006-05-17", grant_date:"2008-11-18", expiry_date:"2028-11-18", description:"Slides normally but pivots outward for emergency stretcher access. Expiring 2028 — technology enters public domain.", status:"expiring_soon" },
  // Overhead Door
  { id:"od1", side:"competitor", company:"Overhead Door", patent_number:"US7143547", title:"Spring-Assisted Swing Door Operator (Universal Hand)", category:"Swing Door", filed_date:"2003-12-31", grant_date:"2006-12-05", expiry_date:"2026-12-05", description:"Universal application (any door hand) without mechanical reconfiguration. Expiring December 2026 — nearly in public domain.", status:"expiring_soon" },
  // LCN / Allegion
  { id:"lcn1", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12241295", title:"Breakaway Sliding Door System (No Bottom Track)", category:"Sliding Door", filed_date:"2023-09-07", grant_date:"2025-03-04", expiry_date:"2045-03-04", description:"Top-hung breakaway system — slides normally but wing pivots outward for emergency egress. No bottom track design.", status:"active" },
  { id:"lcn2", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12203304", title:"Breakaway Sliding Door System (Continuation)", category:"Sliding Door", filed_date:"2023-09-07", grant_date:"2025-01-21", expiry_date:"2045-01-21", description:"Continuation patent covering detent mechanism and latch permitting breakaway pivoting only in closed linear position.", status:"active" },
  { id:"lcn3", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12227979", title:"Door Operator Calibration — Low Energy Compliance", category:"Automatic Door", filed_date:"2021-07-28", grant_date:"2025-02-18", expiry_date:"2045-02-18", description:"Calibration method for BHMA 156.19 low-energy door compliance — measures door mass moment of inertia, determines max safe speed.", status:"active" },
  { id:"lcn4", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12071803", title:"Powered Opening Module — Retrofit for Door Closers", category:"Swing Door", filed_date:"2021-04-08", grant_date:"2024-08-27", expiry_date:"2044-08-27", description:"Retrofit module enables powered door opening on existing hydraulic closers — supports wired/wireless actuators, position sensing.", status:"active" },
  { id:"lcn5", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12071806", title:"Modular Hold-Open Device for Door Closers", category:"Swing Door", filed_date:"2022-12-06", grant_date:"2024-08-27", expiry_date:"2044-08-27", description:"Add-on hold-open module for any hydraulic door closer — mechanical or electronic release without replacing existing hardware.", status:"active" },
  // Norton / Allegion
  { id:"nr1", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US9514583", title:"Door Operator Controller with Touchscreen GUI", category:"Automatic Door", filed_date:"2015-05-12", grant_date:"2016-12-06", expiry_date:"2036-12-06", description:"Touchscreen GUI for configuration, diagnostics, and monitoring of the Norton 6300 Series automatic door operator.", status:"active" },
  { id:"nr2", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US10180023", title:"Apparatus for Electronic Spring Force Control", category:"Swing Door", filed_date:"2016-09-29", grant_date:"2019-01-15", expiry_date:"2039-01-15", description:"Electronically controls and adjusts spring force in door closers — dynamic adjustment without manual spring tension adjustment.", status:"active" },
  // Boon Edam
  { id:"be1", side:"competitor", company:"Boon Edam", patent_number:"US10837225", title:"Revolving Door with Slidable Wing Panels — Two Positions", category:"Revolving Door", filed_date:"2018-09-04", grant_date:"2020-11-17", expiry_date:"2040-11-17", description:"Door wings with retractable panel sections for variable throughput — fully extended or retracted for large items/emergency egress.", status:"active" },
  // ── NEW COMPETITOR PATENTS (deep dive) ──
{ id:"cp_n40", side:"competitor", company:"dormakaba", patent_number:"US12146357", title:"Fire protection securing device for securing a door actuator", category:"Swing Door", filed_date:"2021-07-19", grant_date:"2024-11-19", expiry_date:"2041-07-19", description:"A fire protection securing apparatus for door actuators that uses thermally intumescent material in a reaction chamber to push the door actuator away from the mounting surface (door, frame, or wall) upon fire activation. Ensures automatic detachment of hydraulic door drives in fire events to prevent fluid ignition.", status:"active" },
  { id:"cp_n41", side:"competitor", company:"dormakaba", patent_number:"US12139959", title:"Regulating valve for a door drive and to a door drive", category:"Automatic Door", filed_date:"2021-05-24", grant_date:"2024-11-12", expiry_date:"2041-05-24", description:"A compact regulating valve for hydraulic door drives featuring radial thickenings as sealing sections and a radial tapering as the regulating section, enabling simple and precise manufacture (injection-moulded polyamide with glass fibres). Controls hydraulic flow for door opening/closing speed management.", status:"active" },
  { id:"cp_n42", side:"competitor", company:"dormakaba", patent_number:"US12113399", title:"Door drive with a small high-performance motor unit", category:"Sliding Door", filed_date:"2020-12-03", grant_date:"2024-10-08", expiry_date:"2040-12-03", description:"A compact, high-performance motor unit for automatic sliding door systems with a rotor featuring a support body with receiving fields for permanent magnets adhered with acrylate/anaerobic adhesive. Enables a low-speed high-torque direct drive for large glass door leaves (200–250 kg) with a belt-pulley system.", status:"active" },
  { id:"cp_n43", side:"competitor", company:"dormakaba", patent_number:"US12063005", title:"Method of determining the temperature of a motor winding of an electric door drive motor", category:"Automatic Door", filed_date:"2021-05-17", grant_date:"2024-08-13", expiry_date:"2041-05-17", description:"A sensorless method for monitoring the temperature of an electric door drive motor by measuring winding electrical resistance via a current sensing resistor. Prevents motor overheating without physical temperature sensors, applicable to brushless DC door drive motors in automatic door systems.", status:"active" },
  { id:"cp_n44", side:"competitor", company:"dormakaba", patent_number:"US12049782", title:"Backplate for a door actuator", category:"Swing Door", filed_date:"2021-11-22", grant_date:"2024-07-30", expiry_date:"2041-11-22", description:"A mounting backplate for door actuators (closers/drives) incorporating a shape memory element that thermally activates at 90–200°C to move a connecting assembly from a retaining to a release position, allowing the door actuator to drop away from the mounting surface during fire events.", status:"active" },
  { id:"cp_n45", side:"competitor", company:"dormakaba", patent_number:"US12049779", title:"Door actuator arrangement", category:"Revolving Door", filed_date:"2022-02-24", grant_date:"2024-07-30", expiry_date:"2042-02-24", description:"A door actuator arrangement for swing and revolving doors in which a linkage head mounts on the output shaft first end and a connection element protrudes through the shaft, enabling simplified assembly and secure rotationally-fixed connection between the linkage and output shaft.", status:"active" },
  { id:"cp_n46", side:"competitor", company:"dormakaba", patent_number:"US11939809", title:"Method for operating a door system and door system for same", category:"Automatic Door", filed_date:"2022-02-09", grant_date:"2024-03-26", expiry_date:"2042-02-09", description:"A door system control method using radar sensors or cameras to detect the approach angle of a person and dynamically adjust the door leaf\'s opening width and/or speed accordingly. Applicable to automatic sliding doors, swing doors, and revolving doors to optimize traffic flow and energy efficiency.", status:"active" },
  { id:"cp_n47", side:"competitor", company:"dormakaba", patent_number:"US11898397", title:"Door actuator linkage", category:"Revolving Door", filed_date:"2022-05-24", grant_date:"2024-02-13", expiry_date:"2042-05-24", description:"A door actuator linkage lever with an offset forming a free space for cable routing between the linkage head and an offset surface of the lever. The expanded free space facilitates neat cable management for electrified door closer/drive systems in revolving door assemblies.", status:"active" },
  { id:"cp_n48", side:"competitor", company:"dormakaba", patent_number:"US11840878", title:"Profile system", category:"Sliding Door", filed_date:"2020-01-21", grant_date:"2023-12-12", expiry_date:"2040-01-21", description:"A thermally insulated profile assembly for automatic door systems with horizontally and vertically oriented profile elements connected by a U-shaped connector and insulated by thermally separating elements. Prevents warping of door leaf frames caused by temperature differentials between interior and exterior rooms.", status:"active" },
  { id:"cp_n49", side:"competitor", company:"dormakaba", patent_number:"US11814888", title:"Fire protection fastening device for fastening a door actuator", category:"Swing Door", filed_date:"2021-07-13", grant_date:"2023-11-14", expiry_date:"2041-07-13", description:"A fire protection frame with a thermally intumescent drive element in a reaction chamber that, upon activation, ejects the door actuator from the mounting surface to prevent hydraulic oil from catching fire. Compatible with surface-mounted and in-frame hydraulic door closers/drives.", status:"active" },
  { id:"cp_n50", side:"competitor", company:"dormakaba", patent_number:"US11725445", title:"Backplate for a door actuator", category:"Swing Door", filed_date:"2021-05-14", grant_date:"2023-08-15", expiry_date:"2041-05-14", description:"An earlier version of a thermal-release backplate for door actuators, using a thermally activatable trigger element to move a bar element from a retaining to a release position. Addresses fire safety requirements by automatically detaching door closers from mounting surfaces at elevated temperatures.", status:"active" },
  { id:"cp_n51", side:"competitor", company:"dormakaba", patent_number:"US11578522", title:"Door actuator for opening and/or closing a door", category:"Swing Door", filed_date:"2021-05-18", grant_date:"2023-02-14", expiry_date:"2041-05-18", description:"A door actuator (closer or drive) with a fluid housing featuring a thermally activatable valve and an external collecting device with a drain opening. At ~115°C fire conditions, hydraulic oil is channeled away from the hot mounting surface to prevent ignition, satisfying fire-rated door safety requirements.", status:"active" },
  { id:"cp_n52", side:"competitor", company:"dormakaba", patent_number:"US11447995", title:"Device for moving a door leaf", category:"Swing Door", filed_date:"2020-12-03", grant_date:"2022-09-20", expiry_date:"2040-12-03", description:"A swing door operator using lever kinematics with a rotatably supported connecting element for routing a flat cable (energy/data transmission) between the door-leaf drive and wall-mounted energy source. The rotatable connector prevents cable damage for left-handed and right-handed door configurations (DIN standards).", status:"active" },
  { id:"cp_n53", side:"competitor", company:"dormakaba", patent_number:"US11242705", title:"Door actuator", category:"Swing Door", filed_date:"2019-12-16", grant_date:"2022-02-08", expiry_date:"2039-12-16", description:"A door actuator with a cam disc between two spring-loaded elements of motion, where a distancing arrangement limits minimum distance in specific rotation angle ranges to reduce contact surface load at the closed position. Suitable for door closers, servo door closers, and floor door closers.", status:"active" },
  { id:"cp_n54", side:"competitor", company:"dormakaba", patent_number:"US10982480", title:"Device for at least partially automatically actuating a door leaf", category:"Swing Door", filed_date:"2018-09-13", grant_date:"2021-04-20", expiry_date:"2038-09-13", description:"An automatic swing door drive device using lever kinematics with a cranked connection section and a flat cable (or flexible PCB) transmission means routed through the drive axis of rotation. Enables wire-free power and data transfer from wall to door-leaf drive unit using a multi-layered functional compartment.", status:"active" },
  { id:"cp_n55", side:"competitor", company:"dormakaba", patent_number:"US10876342", title:"Guiding rail for guiding a door leaf between an opening position and a closing position in relation to a door opening in a wall", category:"Swing Door", filed_date:"2018-09-13", grant_date:"2020-12-29", expiry_date:"2038-09-13", description:"A guiding rail for swing door operators incorporating a labyrinth guide that separates the guiding section (sliding element) from the functional section (transmission means for power/data). The labyrinth guide prevents damage to the electrical cable from the sliding element, and an optional arresting section can hold the door open.", status:"active" },
  { id:"cp_n56", side:"competitor", company:"dormakaba", patent_number:"D1031088", title:"Revolving door (Design Patent)", category:"Revolving Door", filed_date:"2021-08-02", grant_date:"2024-06-11", expiry_date:"2039-06-11", description:"An ornamental design patent for the visual appearance of a revolving door product. Covers the aesthetic outer form, canopy, and wing configuration of a dormakaba revolving door entrance system (with broken lines indicating unclaimed portions).", status:"active" },
  { id:"cp_n57", side:"competitor", company:"dormakaba", patent_number:"D1036702", title:"Access control device (Design Patent)", category:"Access Control", filed_date:"2022-09-01", grant_date:"2024-07-23", expiry_date:"2039-07-23", description:"An ornamental design patent for the visual appearance of an access control device (turnstile-type gate). Covers the exterior design of dormakaba\'s passage barrier/speedgate entrance product.", status:"active" },
  { id:"cp_n58", side:"competitor", company:"dormakaba", patent_number:"US11603695", title:"Method for mounting a door drive and door drive", category:"Swing Door", filed_date:"2019-10-30", grant_date:"2023-03-14", expiry_date:"2039-10-30", description:"A method for mounting a swing door drive by using the actuating unit to move the output axle assembly to specific lever mounting positions (0°, 90°, 115°, or 180°) for left/right-opening door configurations, eliminating manual adjustment during installation. Includes a lever mechanism that supports the door actuator between the door leaf and casing.", status:"active" },
  { id:"cp_n59", side:"competitor", company:"dormakaba", patent_number:"US11821257", title:"Passage barrier and method for producing a passage barrier", category:"Access Control", filed_date:"2019-10-11", grant_date:"2023-11-21", expiry_date:"2039-10-11", description:"A passage barrier with plate-shaped barrier elements fixed to a hollow output shaft via a U-shaped adhesive mount with opposing adhesive grooves. The electromechanical drive rotates elements between open and closed gate positions for access-controlled pedestrian entrances in public buildings and stadiums.", status:"active" },
  { id:"cp_n60", side:"competitor", company:"dormakaba", patent_number:"US11668135", title:"Passage barrier", category:"Access Control", filed_date:"2019-10-11", grant_date:"2023-06-06", expiry_date:"2039-10-11", description:"A passage barrier with a profile attachment element for anchoring guide elements to building floors. The attachment element combines a vertical profile mount and horizontal profile feedthrough with integrated cable feedthroughs for electrified systems, enabling simplified on-site installation.", status:"active" },
  { id:"cp_n61", side:"competitor", company:"dormakaba", patent_number:"US11649676", title:"Passage barrier and method for producing a passage barrier", category:"Access Control", filed_date:"2019-10-11", grant_date:"2023-05-16", expiry_date:"2039-10-11", description:"A passage barrier drive where the hollow output shaft surrounds the drive unit (inner shell houses motor), with an integrally formed mount on the outer shell surface for fixing barrier elements. Reduces overall assembly steps and concentrically integrates the motor within the output shaft.", status:"active" },
  { id:"cp_n62", side:"competitor", company:"dormakaba", patent_number:"US11613927", title:"Passage barrier and method for producing a passage barrier", category:"Access Control", filed_date:"2019-10-14", grant_date:"2023-03-28", expiry_date:"2039-10-14", description:"A passage barrier with a locking apparatus on the guide element profile featuring torque transmission teeth engaging complementary teeth on the hollow shaft. A stop disc with a protruding lug limits rotation angle to prevent over-travel of the barrier elements, ensuring precise open/close positioning.", status:"active" },
  { id:"cp_n63", side:"competitor", company:"GEZE GmbH", patent_number:"US10161172", title:"Door closer for a leaf of a door or a window", category:"Swing Door", filed_date:"2014-06-06", grant_date:"2018-12-25", expiry_date:"2034-06-06", description:"A retracting device for a door or window leaf that stores energy during the opening movement and expends it during the closing movement. An electric motor acts as generator to damp leaf movement, with control electronics adapting braking behavior based on detected operating conditions.", status:"active" },
  { id:"cp_n64", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US9514583", title:"Controller for a door operator", category:"Sensors", filed_date:"2015-05-12", grant_date:"2016-12-06", expiry_date:"2034-03-17", description:"Door operator with microprocessor-controlled graphical touchscreen interface allowing user to configure door open/close parameters, speed, and hold-open time. Currently assigned to Assa Abloy Accessories and Door Controls Group Inc (which absorbed LCN / Norton assets).", status:"active" },
  { id:"cp_n65", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US10180023", title:"Apparatus and method for control of spring force in a door closer or operator", category:"Swing Door", filed_date:"2016-09-29", grant_date:"2019-01-15", expiry_date:"2037-03-20", description:"Mechanism for adjusting spring compression within a door operator or closer housing using an externally visible indicator and adjusting screw/nut, enabling field calibration of door closing force without disassembly. Assignee: Assa Abloy Accessories and Door Controls Group Inc.", status:"active" },
  { id:"cp_n66", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12577823", title:"Multi-panel door system, and dual-synchronization drive assembly for a multi-panel door system", category:"Sliding Door", filed_date:"2022-09-26", grant_date:"2026-03-17", expiry_date:"2043-01-13", description:"Drive assembly that synchronizes multi-panel sliding door movement so all panels reach open/closed positions simultaneously at different linear speeds, using a dual gear unit to achieve any required motion/speed ratio. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n67", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12509936", title:"Hybrid drive-thru door and window system", category:"Sliding Door", filed_date:"2022-09-16", grant_date:"2025-12-30", expiry_date:"2043-04-17", description:"Hybrid automatic sliding door system designed for drive-through applications combining a door and window element with operator functionality. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n68", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12247432", title:"Automatic door with radar sensing (mmW sensors)", category:"Sensors", filed_date:"2022-04-08", grant_date:"2025-03-11", expiry_date:"2042-09-11", description:"Automatic door system using multiple millimeter-wave (mmW) radar sensors with integrated IMUs to combine sensor data, detect and track multiple targets, classify them, and predict movements for enhanced door control safety and reliability. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n69", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12188288", title:"Automatic door with radar sensing (mmW sensors) — continuation", category:"Sensors", filed_date:"2022-04-08", grant_date:"2025-01-07", expiry_date:"2042-09-11", description:"Continuation of mmW radar-based automatic door sensor system; same core technology as US12247432 — detection and tracking of multiple targets through combined door area for safety-enhanced door control. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n70", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12006755", title:"Automatic door with radar sensing (mmW sensors) — second continuation", category:"Sensors", filed_date:"2022-04-08", grant_date:"2024-06-11", expiry_date:"2042-09-11", description:"Second continuation of mmW radar-based door sensor patent family. Target classification and prediction for safe/reliable automatic door operation. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n71", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US11555344", title:"Door system having a swing interlock system", category:"Sliding Door", filed_date:"2017-12-08", grant_date:"2023-01-17", expiry_date:"2038-12-16", description:"Sliding door system with interlock plate and guide slot allowing door panel to pivot away from its sliding plane (breakout) when fully open, providing egress. Assignee: Stanley Black & Decker Inc / Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n72", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12291912", title:"Door system with header guide rail, panel hanger, and interlock plate", category:"Sliding Door", filed_date:"2023-01-17", grant_date:"2025-05-06", expiry_date:"2043-07-28", description:"Updated door system with header guide rail notch and interlock plate enabling pivotable panel breakout from sliding plane. Continuation of US11555344 technology. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n73", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US12168893", title:"Slide latching system for sliding door panel", category:"Sliding Door", filed_date:"2017-12-11", grant_date:"2024-12-17", expiry_date:"2038-12-11", description:"Latching system integrated into sliding door panel for positive panel retention in closed position. Assignee: Allegion Access Technologies LLC.", status:"active" },
  { id:"cp_n74", side:"competitor", company:"Allegion (LCN/Norton)", patent_number:"US9506284", title:"Automatic door system with door system user interface", category:"Access Control", filed_date:"2011-11-21", grant_date:"2016-11-29", expiry_date:"2032-06-07", description:"Door controller with programmable user interface allowing scheduling of door operation modes by date/time, with multiple stored operation schedules. Originally assigned to Stanley Black & Decker, Inc. Now under Allegion Access Technologies LLC umbrella.", status:"active" },
  { id:"cp_n75", side:"competitor", company:"Boon Edam", patent_number:"US8595975", title:"Gateway for providing controlled access from an entrance point to an exit point", category:"Access Control", filed_date:"2012-08-10", grant_date:"2013-12-03", expiry_date:"2032-03-16", description:"Speed gate / security gateway using flexible bands that retract inside wall elements when open and bend outward to close passageway. Core technology underlying Boon Edam Speedlane product family. Assignee: Royal Boon Edam International BV.", status:"active" },
  { id:"cp_n76", side:"competitor", company:"Boon Edam", patent_number:"US10612286", title:"Revolving door (carrier-supported door wings)", category:"Revolving Door", filed_date:"2018-10-26", grant_date:"2020-04-07", expiry_date:"2037-04-24", description:"Revolving door where each door wing is supported by a dedicated movable carrier comprising horizontal and vertical bars, improving structural integrity and smooth rotation. Assignee: Royal Boon Edam International BV.", status:"active" },
  { id:"cp_n77", side:"competitor", company:"Boon Edam", patent_number:"US10837225", title:"Revolving door (slidable door wing parts)", category:"Revolving Door", filed_date:"2018-09-04", grant_date:"2020-11-17", expiry_date:"2037-03-11", description:"Revolving door design with each wing comprising only slidable sub-panels that can be positioned radially inward (toward axis) or outward (toward wall), enabling variable diameter/throughput configurations. Assignee: Royal Boon Edam International BV.", status:"active" },
  { id:"cp_n78", side:"competitor", company:"Boon Edam", patent_number:"US11091953", title:"Revolving door (with emergency sliding door panels)", category:"Revolving Door", filed_date:"2019-11-07", grant_date:"2021-08-17", expiry_date:"2038-06-01", description:"Revolving door (2 wings) with sliding door panels at the entrance/exit apertures that normally connect to door wing ends; in emergency the two panel parts separate to provide unobstructed egress. Assignee: Royal Boon Edam International BV.", status:"active" },
  { id:"cp_n79", side:"competitor", company:"Boon Edam", patent_number:"US12338675", title:"Door arrangement (access gate for high-traffic passageways)", category:"Access Control", filed_date:"2024-02-05", grant_date:"2025-06-24", expiry_date:"2042-07-27", description:"Door arrangement with frame profile defining a passageway opening, door hinged outside the opening, classified under turnstiles/gates for control of entry/exit in high-traffic facilities (e.g., supermarkets). Assignee: Royal Boon Edam International BV.", status:"active" },
  { id:"cp_n80", side:"competitor", company:"Boon Edam", patent_number:"US10458170", title:"Anti-fall safety system for wings, doors, main doors, up-and-over doors, windows", category:"Sliding Door", filed_date:"2015-05-27", grant_date:"2019-10-29", expiry_date:"2035-05-27", description:"Safety system preventing detachment of a first component (e.g., sliding panel) from a second component (e.g., track) using a flexible elongated element with engagement point. Note: current assignee shown as SERRAMETAL Srl, not Boon Edam; may represent a portfolio transfer or misidentified cross-reference. Review recommended.", status:"active" },
  { id:"cp_n81", side:"competitor", company:"Nabco Entrances", patent_number:"US11261650", title:"Automatic door sensor, automatic door system, and method of controlling automatic door system", category:"Sensors", filed_date:"2018-02-05", grant_date:"2022-03-01", expiry_date:"2038-05-21", description:"Automatic door sensor with a special detection area operating two algorithms simultaneously: an activation algorithm for normal person/object detection and a protection algorithm with higher sensitivity. Results output independently to door controller for enhanced safety. Assignee: Nabtesco Corp.", status:"active" },
  { id:"cp_n82", side:"competitor", company:"Nabco Entrances", patent_number:"US7451802", title:"Slidable door assemblies with automatic pivot latching", category:"Sliding Door", filed_date:"2003-05-08", grant_date:"2008-11-18", expiry_date:"2028-03-14", description:"Sliding door assembly with automatic pivot latch that locks door panel to hinge for breakout egress function. Key patent for Nabco Entrances product line. Assignee: Nabco Entrances Inc. Note: 20-year term from filing = ~2023, but adjustments may extend to 2028 per original task data.", status:"expiring_soon" },
  { id:"cp_n83", side:"competitor", company:"Overhead Door", patent_number:"US11414911", title:"Swing door operator with offset spring", category:"Swing Door", filed_date:"2020-01-24", grant_date:"2022-08-16", expiry_date:"2040-07-22", description:"Swing door operator where powered driver compresses a spring via drive unit/spindle during opening, then spring expands to close door. Spring mount pivotable between operating and servicing configurations for easier field maintenance. Assignee: Overhead Door Corp.", status:"active" },
  { id:"cp_n84", side:"competitor", company:"Overhead Door", patent_number:"US11401747", title:"Motor assisted revolving door system and method with multiple sensors", category:"Revolving Door", filed_date:"2020-03-03", grant_date:"2022-08-02", expiry_date:"2040-09-22", description:"Control system for a revolving door motor that operates only when both an object sensor (presence) AND an operation sensor (movement) simultaneously detect activity, reducing false activations and improving energy efficiency. Assignee: Overhead Door Corp.", status:"active" },
  { id:"cp_n85", side:"competitor", company:"Overhead Door", patent_number:"US11282319", title:"Secure exit lane door", category:"Access Control", filed_date:"2019-02-05", grant_date:"2022-03-22", expiry_date:"2039-02-05", description:"Door system defining a corridor (mantrap/airlock) with sensors determining direction of movement; doors close automatically if movement in undesired direction is detected beyond threshold. Assignee: Overhead Door Corp.", status:"active" },
  { id:"cp_n86", side:"competitor", company:"Overhead Door", patent_number:"US11053725", title:"Sliding barrier tracking system", category:"Sliding Door", filed_date:"2018-04-11", grant_date:"2021-07-06", expiry_date:"2038-11-28", description:"Sliding door system with driveshaft/motor using a belt and rotary encoder directly correlated to panel movement (not motor shaft) for accurate door position measurement independent of motor slip or belt stretch. Assignee: Overhead Door Corp.", status:"active" },
  { id:"cp_n87", side:"competitor", company:"Overhead Door", patent_number:"US11053729", title:"Door system and method with early warning sensors", category:"Sensors", filed_date:"2018-06-29", grant_date:"2021-07-06", expiry_date:"2038-12-11", description:"Door control system combining a motion sensor and an object recognition sensor; door controller only signals motor operation when both sensors confirm presence and recognition. Adds early warning threat detection for security applications. Assignee: Overhead Door Corp.", status:"active" },
  { id:"cp_n88", side:"competitor", company:"Overhead Door", patent_number:"US7143547", title:"Automatic door assembly (Overhead Door — known)", category:"Automatic Door", filed_date:"2002-05-21", grant_date:"2006-12-05", expiry_date:"2026-12-05", description:"Known prior-art automatic door assembly patent from Overhead Door Corporation. Expiring December 2026 — monitor for freedom-to-operate opportunities.", status:"expiring_soon" },
  { id:"cp_n89", side:"competitor", company:"Gilgen Door Systems (KONE)", patent_number:"US12473764", title:"Suspension assembly for a sliding door", category:"Sliding Door", filed_date:"2022-07-11", grant_date:"2025-11-18", expiry_date:"2042-07-11", description:"Suspension assembly for a sliding door leaf comprising a suspension part (for movable suspension of the door leaf) and an attachable component part (holding drive motor and/or other components). The component part hangs on the suspension part between two support points arranged to balance the center of gravity. Assignee: Gilgen Door Systems AG (Schwarzenburg, Switzerland) — KONE Group subsidiary since 2011.", status:"active" },
  { id:"cp_n90", side:"competitor", company:"Gilgen Door Systems (KONE)", patent_number:"US9759001", title:"Rotary-leaf/-casement drive", category:"Swing Door", filed_date:"2013-04-05", grant_date:"2017-09-12", expiry_date:"2033-04-05", description:"Rotary drive for swing/casement door leaf featuring an output shaft driven by a motor via a downstream gear mechanism, with an energy-store module (spring) applying pressure via an eccentric cam disk on the output shaft for conjoint rotation. Intermediate shaft offset from line of action; roller lever with cam-follower roller presses against cam disk. Provides smooth, controlled door swing with stored energy for closing. Assignee: Gilgen Door Systems AG.", status:"active" },
];

const ALL_PATENTS = [...OUR_PATENTS, ...COMPETITOR_PATENTS];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getYear(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return parseInt(dateStr.split("-")[0]);
}

function getStatusColor(status: PatentStatus | "N/A") {
  if (status === "active") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
  if (status === "expiring_soon") return "text-amber-400 bg-amber-400/10 border-amber-400/30";
  if (status === "expired") return "text-zinc-500 bg-zinc-500/10 border-zinc-500/30";
  return "text-zinc-500 bg-zinc-500/10 border-zinc-500/30";
}

function getStatusIcon(status: PatentStatus | "N/A") {
  if (status === "active") return <CheckCircle className="w-3 h-3" />;
  if (status === "expiring_soon") return <AlertTriangle className="w-3 h-3" />;
  return <XCircle className="w-3 h-3" />;
}

function getStatusLabel(status: PatentStatus | "N/A") {
  if (status === "active") return "Active";
  if (status === "expiring_soon") return "Expiring Soon";
  if (status === "expired") return "Expired";
  return "N/A";
}

const CATEGORIES = ["All", "Sliding Door", "Swing Door", "Revolving Door", "Sensors", "Access Control", "Automatic Door", "Industrial / Loading Dock"];
const COMPANIES_OURS = ["All", "ASSA ABLOY Entrance Systems"];
const COMPANIES_COMP = ["All", "dormakaba", "GEZE GmbH", "Allegion (LCN/Norton)", "Boon Edam", "Nabco Entrances", "Overhead Door", "Horton Automatics", "Gilgen Door Systems (KONE)"];

// ─── TIMELINE VIEW ────────────────────────────────────────────────────────────
function TimelineView({ patents }: { patents: Patent[] }) {
  const years = Array.from({ length: 30 }, (_, i) => 2020 + i);
  const today = new Date().getFullYear();

  const buckets: Record<number, Patent[]> = {};
  patents.forEach(p => {
    if (p.expiry_date && p.status !== "expired") {
      const y = getYear(p.expiry_date);
      if (y && y >= 2020 && y <= 2049) {
        if (!buckets[y]) buckets[y] = [];
        buckets[y].push(p);
      }
    }
  });

  const maxCount = Math.max(...Object.values(buckets).map(v => v.length), 1);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground mb-1">Patent expiry timeline — each bar represents patents expiring that year. Hover for details.</div>
      <div className="flex items-end gap-[3px] h-40 px-2 overflow-x-auto pb-1">
        {years.map(yr => {
          const pts = buckets[yr] || [];
          const ourCount = pts.filter(p => p.side === "ours").length;
          const compCount = pts.filter(p => p.side === "competitor").length;
          const heightPct = pts.length > 0 ? (pts.length / maxCount) * 100 : 0;
          const isPast = yr < today;
          const isPresent = yr === today;

          return (
            <div
              key={yr}
              className="flex flex-col items-center gap-1 cursor-pointer group relative shrink-0"
              style={{ width: 28 }}
              onMouseEnter={() => setHoveredYear(yr)}
              onMouseLeave={() => setHoveredYear(null)}
            >
              {hoveredYear === yr && pts.length > 0 && (
                <div className="absolute bottom-full mb-2 z-20 bg-zinc-800 border border-zinc-600 rounded-lg p-3 w-56 shadow-xl pointer-events-none">
                  <div className="text-xs font-semibold text-white mb-2">{yr} — {pts.length} patent{pts.length !== 1 ? "s" : ""} expiring</div>
                  {pts.map(p => (
                    <div key={p.id} className="text-[10px] text-zinc-300 leading-tight mb-1">
                      <span className={p.side === "ours" ? "text-primary" : "text-amber-400"}>
                        {p.side === "ours" ? "▶" : "◆"}
                      </span>{" "}
                      {p.patent_number} — {p.title.length > 40 ? p.title.slice(0, 40) + "…" : p.title}
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full flex flex-col justify-end" style={{ height: 120 }}>
                {pts.length > 0 ? (
                  <div style={{ height: `${heightPct}%` }} className="w-full flex flex-col justify-end gap-px min-h-[4px]">
                    {ourCount > 0 && (
                      <div
                        style={{ flex: ourCount }}
                        className="w-full rounded-sm bg-primary/80 group-hover:bg-primary transition-colors"
                      />
                    )}
                    {compCount > 0 && (
                      <div
                        style={{ flex: compCount }}
                        className="w-full rounded-sm bg-amber-500/70 group-hover:bg-amber-500 transition-colors"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[2px] bg-zinc-700/30" />
                )}
              </div>

              <div className={`text-[9px] rotate-[-60deg] origin-top-right whitespace-nowrap mt-1 ${isPresent ? "text-white font-bold" : isPast ? "text-zinc-600" : "text-zinc-400"}`}>
                {yr}
              </div>
              {isPresent && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/20 -z-10" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-primary" /> Our IP (ASSA ABLOY / Record / Entrematic)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500" /> Competitor IP</div>
      </div>

      {/* Opportunity callouts */}
      <div className="mt-4 space-y-2">
        <div className="text-xs font-semibold text-white uppercase tracking-wider">Expiry Opportunities</div>
        {COMPETITOR_PATENTS.filter(p => p.status === "expiring_soon").map(p => (
          <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-white">{p.company} — {p.patent_number}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{p.title}</div>
              <div className="text-xs text-amber-400 mt-1">Expires {p.expiry_date} — technology enters public domain</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PATENT CARD ──────────────────────────────────────────────────────────────
function PatentCard({ patent }: { patent: Patent }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      className="border border-border rounded-lg bg-card overflow-hidden"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="shrink-0 mt-0.5">
          <Shield className={`w-4 h-4 ${patent.side === "ours" ? "text-primary" : "text-amber-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-[11px] font-mono text-muted-foreground">{patent.patent_number}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-medium border px-1.5 py-0.5 rounded-full ${getStatusColor(patent.status)}`}>
              {getStatusIcon(patent.status)}
              {getStatusLabel(patent.status)}
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{patent.category}</span>
          </div>
          <div className="text-xs font-semibold text-foreground leading-snug">{patent.title}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{patent.company}</div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1 text-[10px] text-muted-foreground">
          {patent.expiry_date && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {patent.expiry_date.slice(0, 4)}
            </div>
          )}
          {expanded ? <ChevronUp className="w-3 h-3 mt-1" /> : <ChevronDown className="w-3 h-3 mt-1" />}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-0 border-t border-border/50">
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{patent.description}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-muted-foreground">
                {patent.filed_date && <span>Filed: <span className="text-foreground">{patent.filed_date}</span></span>}
                {patent.grant_date && <span>Granted: <span className="text-foreground">{patent.grant_date}</span></span>}
                {patent.expiry_date && <span>Expires: <span className={`font-semibold ${patent.status === "expiring_soon" ? "text-amber-400" : patent.status === "expired" ? "text-zinc-500" : "text-emerald-400"}`}>{patent.expiry_date}</span></span>}
              </div>
              <a
                href={`https://patents.google.com/patent/${patent.patent_number}/en`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-2 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> View on Google Patents
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TABLE VIEW ───────────────────────────────────────────────────────────────
function TableView({ patents }: { patents: Patent[] }) {
  const [sort, setSort] = useState<"expiry" | "company" | "status">("expiry");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...patents].sort((a, b) => {
      let va = "", vb = "";
      if (sort === "expiry") { va = a.expiry_date || "9999"; vb = b.expiry_date || "9999"; }
      if (sort === "company") { va = a.company; vb = b.company; }
      if (sort === "status") { va = a.status; vb = b.status; }
      return asc ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [patents, sort, asc]);

  const toggle = (col: typeof sort) => {
    if (sort === col) setAsc(a => !a);
    else { setSort(col); setAsc(true); }
  };

  const th = (col: typeof sort, label: string) => (
    <th
      className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2 cursor-pointer hover:text-foreground transition-colors"
      onClick={() => toggle(col)}
    >
      {label} {sort === col ? (asc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-[700px]">
        <thead className="border-b border-border">
          <tr>
            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2 w-6"></th>
            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">Patent #</th>
            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">Title</th>
            {th("company", "Company")}
            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-2">Category</th>
            {th("status", "Status")}
            {th("expiry", "Expiry")}
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
              <td className="px-3 py-2">
                <Shield className={`w-3.5 h-3.5 ${p.side === "ours" ? "text-primary" : "text-amber-400"}`} />
              </td>
              <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">{p.patent_number}</td>
              <td className="px-3 py-2 font-medium text-foreground max-w-[220px]">
                <span className="line-clamp-2 leading-snug">{p.title}</span>
              </td>
              <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{p.company}</td>
              <td className="px-3 py-2">
                <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full text-[10px]">{p.category}</span>
              </td>
              <td className="px-3 py-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-medium border px-1.5 py-0.5 rounded-full ${getStatusColor(p.status)}`}>
                  {getStatusIcon(p.status)}
                  {getStatusLabel(p.status)}
                </span>
              </td>
              <td className={`px-3 py-2 whitespace-nowrap font-mono text-[10px] ${p.status === "expiring_soon" ? "text-amber-400 font-semibold" : p.status === "expired" ? "text-zinc-500" : "text-muted-foreground"}`}>
                {p.expiry_date || "—"}
              </td>
              <td className="px-3 py-2">
                <a
                  href={`https://patents.google.com/patent/${p.patent_number}/en`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar({ patents }: { patents: Patent[] }) {
  const active = patents.filter(p => p.status === "active").length;
  const expiring = patents.filter(p => p.status === "expiring_soon").length;
  const expired = patents.filter(p => p.status === "expired").length;
  const ours = patents.filter(p => p.side === "ours").length;
  const comp = patents.filter(p => p.side === "competitor" && p.status !== "N/A").length;

  const stats = [
    { label: "Our Patents", value: ours, color: "text-primary" },
    { label: "Competitor Patents", value: comp, color: "text-amber-400" },
    { label: "Active", value: active, color: "text-emerald-400" },
    { label: "Expiring by 2029", value: expiring, color: "text-amber-400" },
    { label: "Expired / Public Domain", value: expired, color: "text-zinc-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="bg-card border border-border rounded-lg px-3 py-2.5">
          <div className={`text-xl font-bold ${s.color}`} style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{s.value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function IPTracker() {
  const [view, setView] = useState<"table" | "timeline">("table");
  const [scope, setScope] = useState<"all" | "ours" | "competitor">("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | PatentStatus>("all");
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  const filtered = useMemo(() => {
    return ALL_PATENTS.filter(p => {
      if (scope === "ours" && p.side !== "ours") return false;
      if (scope === "competitor" && p.side !== "competitor") return false;
      if (category !== "All" && p.category !== category) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (p.status === "N/A") return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) &&
            !p.company.toLowerCase().includes(q) &&
            !p.patent_number.toLowerCase().includes(q) &&
            !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [scope, category, statusFilter, search]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SuiteNav />

      {/* Header */}
      <header className="sticky top-[30px] z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                IP Tracker
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">Patent Intelligence — Entrance Systems</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <StatsBar patents={ALL_PATENTS.filter(p => p.status !== "N/A")} />

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Scope tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["all", "ours", "competitor"] as const).map(s => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${scope === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {s === "all" ? "All Patents" : s === "ours" ? "Our IP" : "Competitor IP"}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {([["all", "All"], ["active", "Active"], ["expiring_soon", "Expiring"], ["expired", "Expired"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val as "all" | PatentStatus)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${statusFilter === val ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category select */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-muted border-0 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Search */}
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patents…"
              className="bg-transparent text-xs focus:outline-none text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 ml-auto">
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-md transition-colors ${view === "table" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Table view"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("timeline")}
              className={`p-1.5 rounded-md transition-colors ${view === "timeline" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Timeline view"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Result count */}
        <div className="text-xs text-muted-foreground mb-3">
          {filtered.length} patent{filtered.length !== 1 ? "s" : ""} — {filtered.filter(p => p.side === "ours").length} ours · {filtered.filter(p => p.side === "competitor").length} competitor
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === "timeline" ? (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-card border border-border rounded-xl p-4">
                <TimelineView patents={filtered} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Cards for mobile, table for desktop */}
              <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
                <TableView patents={filtered} />
              </div>
              <div className="md:hidden space-y-2">
                {filtered.map(p => <PatentCard key={p.id} patent={p} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No patents match your filters.
          </div>
        )}
      </main>
    </div>
  );
}
