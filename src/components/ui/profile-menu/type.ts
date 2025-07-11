import { SyntheticEvent } from "react";

export type ProfileMenuUIProps = {
  pathname: string;
  handleLogout: (e: SyntheticEvent) => void;
};
