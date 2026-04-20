"use client";

import { SectionWrapper } from "@/components/common/SectionWrapper";
import { CustomTabs } from "@/components/common/CustomTabs";
import { RulesContent, type RulesData } from "@/components/rules/RulesContent";

const SPORT_TABS = [
  { value: "cricket",     label: "Cricket",      icon: "🏏" },
  { value: "football",    label: "Football",     icon: "⚽" },
  { value: "tennis",      label: "Tennis",       icon: "🎾" },
  { value: "badminton",   label: "Badminton",    icon: "🏸" },
  { value: "tabletennis", label: "Table Tennis", icon: "🏓" },
  { value: "swimming",    label: "Swimming",     icon: "🏊" },
  { value: "chess",       label: "Chess",        icon: "♟️" },
  { value: "skating",     label: "Skating",      icon: "🛼" },
  { value: "pickleball",  label: "Pickleball",   icon: "🏓" },
  { value: "athletics",   label: "Athletics",    icon: "🏃" },
];

const RULES_DATA: Record<string, RulesData> = {
  cricket: {
    overview:
      " Governed by the International Cricket Council, is played between two teams of 11 players where one team bats to score runs and the other bowls and fields to restrict runs and take wickets; matches can be played in formats like T20 (20 overs), ODI (50 overs), or Test (5 days), and a team wins by scoring more runs than the opponent, with rules including dismissals like bowled, caught, LBW, and run-out.",
    ageCategories: ["Under-12", "Under-14", "Under-16", "Under-19", "Senior (open)"],
    scoringSystem: [
      "Each run scored by the batting team adds 1 point.",
      "Boundaries: 4 runs (ground contact), 6 runs (clean over boundary).",
      "Wickets reduce the batting order; the innings ends at 10 wickets.",
      "Bonus points awarded for net run-rate in group stages.",
    ],
    disqualificationRules: [
      "Use of banned substances or doping results in immediate disqualification.",
      "Ball tampering leads to 5-run penalty and possible match ban.",
      "Deliberate time-wasting after two warnings results in disqualification.",
      "Verbal or physical abuse of an opponent or umpire leads to immediate removal.",
    ],
  },
  football: {
    overview:
      "Governed by the FIFA, is played between two teams of 11 players each, where the objective is to score goals by getting the ball into the opponent's net without using hands or arms (except the goalkeeper); matches are typically 90 minutes long, divided into two halves of 45 minutes each, and the team with more goals wins, while rules include offsides, fouls, free kicks, penalties, and throw-ins.",
    ageCategories: ["Under-10", "Under-12", "Under-14", "Under-16", "Under-18", "Senior", "Masters/Veterans (35+, 40+)"],
    scoringSystem: [
      "Each goal counts as 1 point.",
      "Penalty shoot-outs used to decide draws in knockout rounds.",
      "Group stage: Win = 3 pts, Draw = 1 pt, Loss = 0 pts.",
      "Goal difference and head-to-head used as tiebreakers.",
    ],
    disqualificationRules: [
      "Two yellow cards in a single match result in a red card and ejection.",
      "A straight red card earns at least a one-match suspension.",
      "Violent conduct off-ball leads to immediate disqualification from the tournament.",
      "Fielding an ineligible player results in a 3-0 forfeit.",
    ],
  },
  tennis: {
    overview:
      "Governed by the International Tennis Federation, is played in singles or doubles where players score points by hitting the ball over the net into the opponent's court, aiming to win points when the opponent fails to return it; matches are usually played as best of 3 or 5 sets, with each set won by reaching 6 games (with at least a 2-game lead), and scoring follows the sequence 15, 30, 40, and game. Players must serve diagonally into the service box, and faults like double bounce or hitting outside boundaries result in loss of point.",
    ageCategories: ["Under-10", "Under-12", "Under-14", "Under-16", "Under-18", "Senior", "Masters (35+, 40+, 45+, 50+)"],
    scoringSystem: [
      "Points: Love (0), 15, 30, 40; deuce at 40-40 requires two consecutive points.",
      "Six games win a set; tiebreak at 6-6.",
      "Best of 3 sets for most categories; best of 5 for Open Men's finals.",
      "Super tiebreak (10 points) used in lieu of third set for doubles.",
    ],
    disqualificationRules: [
      "Three code violations in a match result in disqualification.",
      "Racket abuse after one warning leads to point penalty then game penalty.",
      "Refusing to continue play after a legitimate ruling results in default.",
      "Positive doping test results in immediate disqualification and suspension.",
    ],
  },
  badminton: {
    overview:
      "Governed by the Badminton World Federation, is played in singles or doubles where players score points by hitting the shuttlecock over the net and landing it within the opponent's court; matches are played as best of 3 games, each up to 21 points with a 2-point lead required, and a rally-point system is used where a point is scored on every serve. Players must serve diagonally, below the waist, and stay within court boundaries during play.",
    ageCategories: ["Under-11", "Under-13", "Under-15", "Under-17", "Under-19", "Senior (open)", "Masters (35+, 40+, 45+, 50+)"],
    scoringSystem: [
      "Best of 3 games; each game played to 21 points.",
      "A side must win by 2 points; game cap is 30-29.",
      "The side winning 2 games first wins the match.",
      "Service alternates based on points scored.",
    ],
    disqualificationRules: [
      "Deliberate shuttle abuse or delay of play results in point penalty.",
      "Two consecutive conduct penalties lead to game forfeit.",
      "Physical contact with an opponent results in immediate disqualification.",
      "Using non-regulation shuttlecocks without umpire approval forfeits the rally.",
    ],
  },
  tabletennis: {
    overview:
      " Governed by the International Table Tennis Federation, is played between two (singles) or four players (doubles) where the objective is to score points by making the ball land on the opponent’s side without a valid return; games are usually played up to 11 points with at least a 2-point lead, and matches are typically best of 5 or 7 games. Players must serve diagonally in doubles and follow rules like alternating serves every 2 points.",
    ageCategories: ["Under-11", "Under-13", "Under-15", "Under-17", "Under-19 (junior level)",],
    scoringSystem: [
      "Games played to 11 points (must win by 2).",
      "Best of 5 or 7 games in match play.",
      "Service alternates every 2 points in game play.",
      "Expedite rule applied if a game exceeds 10 minutes.",
    ],
    disqualificationRules: [
      "Deliberate bat damage or surface alteration during play is prohibited.",
      "Obstructing the ball path with the free hand leads to a point loss.",
      "Two conduct warnings result in disqualification from the match.",
      "Coaching during play is prohibited in singles events.",
    ],
  },
  swimming: {
    overview:
      "Governed by the FINA (now known as World Aquatics), is a competitive sport where swimmers race in a pool using different strokes like freestyle, backstroke, breaststroke, and butterfly, aiming to complete the set distance in the shortest time; races start with a dive (except backstroke), and swimmers must follow proper technique rules for each stroke, including legal turns and finishes, or they may be disqualified.",
    ageCategories: ["Under-8", "Under-10", "Under-12", "Under-14", "Under-16", "Under-18", "Senior", "Masters (25+)"],
    scoringSystem: [
      "Races are won by the shortest completion time.",
      "Fastest time in qualifying heats advances to finals.",
      "Athletes must complete the full distance and touch the wall at the finish.",
      "Relay teams score based on combined individual times.",
    ],
    disqualificationRules: [
      "Improper stroke technique results in disqualification.",
      "False start after warning leads to disqualification.",
      "Not touching the wall properly at the turn results in disqualification.",
      "Interfering with other swimmers leads to immediate disqualification.",
    ],
  },
  chess: {
    overview:
      "Governed by the FIDE, is played between two players on a 64-square board where the objective is to checkmate the opponent's king; each piece moves in a specific way (like bishops diagonally, rooks straight, knights in L-shape), and the game can also end in a draw by stalemate, repetition, or agreement, while official matches often use time controls (like rapid or classical) with clocks to limit thinking time. There are several tactics in chess, here are some key ones: Pins, Forks, Skewer, Discovered attacks, Double attacks, Overloading, Deflection, X-ray attacks. Three phases of chess: Opening: Develop pieces, control center, and get your king safe (castling). Middlegame: Attack, defend, and strategize to gain an advantage. Endgame: Convert advantages into wins, often focusing on pawns and king activity. Some important rules: Castling: Move king to opposite side of rook, with no pieces in between, and king not in check. En passant: Capture pawn as if it moved two squares, but only on next move. Promotion: Pawn reaches end, becomes any piece (usually queen).",
    ageCategories: ["Under-7", "Under-9", "Under-11", "Under-13", "Under-15", "Under-17", "Under-19", "Open", "Veterans (50+)"],
    scoringSystem: [
      "Win = 1 point, Draw = 0.5 point, Loss = 0 points.",
      "Best of 3 or 5 games in match play.",
      "Ratings determined by tournament results and FIDE rating system.",
      "Time controls vary: Rapid, Classical, and Blitz formats.",
    ],
    disqualificationRules: [
      "Touching a piece without intention to move results in penalties.",
      "Exceeding time limit results in immediate loss.",
      "Using external assistance or electronic devices leads to disqualification.",
      "Unsportsmanlike conduct results in match forfeit and tournament ban.",
    ],
  },
  skating: {
    overview:
      "Governed by the World Skate, is a sport where players race or perform on skates, aiming to complete the distance in the shortest time or execute skills with balance and control; in racing events, skaters must stay within track limits, avoid fouls like pushing or obstruction, and follow proper start and finish rules, while in artistic skating, scoring is based on technique, creativity, and execution.",
    ageCategories: ["Under-6", "Under-8", "Under-10", "Under-12", "Under-14", "Under-17", "Senior", "Masters (35+)"],
    scoringSystem: [
      "Racing: Fastest time wins the event.",
      "Artistic: Judged on technique, creativity, and execution (points awarded by judges).",
      "Obstacle course: Based on time and penalty points for mistakes.",
      "Relay events: Combined times of all team members determine placement.",
    ],
    disqualificationRules: [
      "Pushing or obstructing other skaters results in disqualification.",
      "Skates must meet regulation standards or athlete is disqualified.",
      "Leaving track boundaries during a race results in disqualification.",
      "Unsafe equipment or improper attire leads to disqualification.",
    ],
  },
  pickleball: {
    overview:
      "Governed internationally by the International Federation of Pickleball, is played in singles or doubles on a small court where players use paddles to hit a perforated ball over the net, aiming to score points by making the opponent miss or fault; games are usually played to 11 points (win by 2), only the serving side can score, and key rules include the underhand serve, the double-bounce rule (ball must bounce once on each side before volleys), and the non-volley zone (kitchen) where volleys are not allowed.",
    ageCategories: ["Under-12", "Under-14", "Under-16", "Under-18", "Senior", "Masters (35+, 40+, 50+)"],
    scoringSystem: [
      "Games played to 11 points (must win by 2).",
      "Only the serving side can score points.",
      "Best of 3 games in match play.",
      "Doubles: Server calls their score, opponent's score, and game number.",
    ],
    disqualificationRules: [
      "Vollying in the non-volley zone (kitchen) results in loss of point.",
      "Ball must bounce once on each side before volleys (double-bounce rule).",
      "Serve must be underhand and below waist level.",
      "Hitting above net level or into the net on serve results in side-out.",
    ],
  },
  athletics: {
    overview:
      "Governed by World Athletics, includes track and field events such as running, jumping, and throwing, where athletes compete to achieve the fastest time, longest distance, or highest height; rules vary by event—for example, runners must stay in their lanes in sprint races, false starts lead to disqualification, and field events like long jump or shot put require proper technique and valid attempts within marked areas.",
    ageCategories: ["Under-10", "Under-12", "Under-14", "Under-16", "Under-18", "Under-20", "Senior", "Masters (35+, 40+, 50+)"],
    scoringSystem: [
      "Track: Fastest time wins; measured in hundredths of a second.",
      "Field: Longest distance or highest height wins.",
      "Relays: Combined times of all team members determine placement.",
      "Points awarded in multi-event competitions based on placement.",
    ],
    disqualificationRules: [
      "False start in sprint races results in disqualification.",
      "Stepping out of lane in sprints results in disqualification.",
      "Improper technique in field events leads to invalid attempts.",
      "Doping or banned substance use results in immediate disqualification and ban.",
    ],
  },
};

interface RulesSectionProps {
  title?: string;
  subtitle?: string;
}

export function RulesSection({
  title = "Rules & Regulations",
  subtitle = "Know the rules before you compete — official guidelines for each sport",
}: RulesSectionProps) {
  return (
    <SectionWrapper id="rules" title={title} subtitle={subtitle} className="bg-[#F4F6F8]">
      <CustomTabs tabs={SPORT_TABS} variant="dark" scrollable>
        {(activeTab) => (
          <RulesContent data={RULES_DATA[activeTab]} />
        )}
      </CustomTabs>
    </SectionWrapper>
  );
}
