- [x] Add ID Maker to login role picker and quick role switcher
- [x] Add new sidebar nav item data-module="id-maker-dashboard"
- [x] Add mod-id-maker-dashboard module with demo UI (KPIs + production queue + AI insights)
- [x] Update RBAC applyRoleToUI to show/hide module + nav item for ID Maker
- [x] Verify navigation guards for unauthorized modules

## ID Card Template & Print Layout
- [x] Add ID Card modal with front and back preview (CR80 credit card ratio)
- [x] Front side: OSCA header, photo, name, address, DOB, sex, SCB ID, validity, control number
- [x] Back side: Senior Citizen privileges, RA 9994 reminder, barcode, signature lines
- [x] Front/back toggle with tab buttons
- [x] Print CSS (@media print) — hides UI, shows only the card for printing
- [x] "Generate & Print Form" button now opens the ID card modal
- [x] "Preview ID" button added to each ID Maker queue row
- [x] Batch Print button opens preview for first queued application

## Bug Fixes
- [x] Define missing STATUS_ICON_SVGS constant (prevents runtime crash in status dropdown)
- [x] Add missing idcard-modal HTML (CR80 ID card preview with front/back sides)
- [x] Add missing print-detail-modal HTML (limited data view for ID Maker accounts)
- [x] Add CSS for ID card modal and CR80 card preview (@media print included)
- [x] Restrict ID Maker "View" button to show only printing data (Name, DOB, Address, Sex)
