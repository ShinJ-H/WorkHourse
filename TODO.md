# TODO

## Project status sync & role-based visibility
- [ ] Fix backend `getProjectStatusStats` filtering for normal users (team array vs team: req.user._id).
- [ ] Ensure user updates to project status cause Admin/Manager dashboards to refresh counts (already uses `projectUpdated` event; no backend change needed for counts).
- [ ] (Optional hardening) Restrict project/task update endpoints so normal users can only update their assigned items; Admin/Manager can update all.

