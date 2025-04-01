import { StringPartToDelimiterCase } from 'type-fest/source/delimiter-case';

export enum Platform {
  PolyGloT,
  VirtualStudio,
  Papyrus,
  WebApp,
  WorkAdventure,
}

export enum ZoneId {
  FreeZone,
  OutsideZone,
  SilentZone,
  LearningPathSelectionZone,
  InstructionWebpageZone,
  WebAppZone,
  MeetingRoomZone,
  PolyGlotLearningZone,
  PolyGlotLearningPathCreationZone,
  PapyrusWebZone,
  VirtualStudioZone,
}

//Action Body
export type AnalyticsActionBody = {
  timestamp: Date;
  userId: string;
  actionType: string;
  zoneId: ZoneId;
  platform: Platform;
  action: any;
};

export type OpenLPInfoAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type CloseLPInfoAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type SelectRemoveLPAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type OpenCloseTool = AnalyticsActionBody & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};
