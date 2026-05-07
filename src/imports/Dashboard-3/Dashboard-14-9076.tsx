import svgPaths from "./svg-b4sb4bwjm3";
import imgChatGptImageMar292026045234Am1 from "./aebb91ca0093e01d7462a4835045dc9ba2d0c4c6.png";
import imgUkFlag1 from "./7260fbd7cccd7993400c3b1165f33370bf034acd.png";
import imgEllipse18 from "./6c4009bed7a62ce79249e3e38d12c49f634b5f89.png";
import { imgUkFlag } from "./svg-qia9o";

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[16px] whitespace-nowrap">
        <p className="leading-[1.3]">Admin Dashboard</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[40px]" data-name="ChatGPT Image Mar 29, 2026, 04_52_34 AM 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[124.84%] left-[-13.35%] max-w-none top-[-7.24%] w-[125.49%]" src={imgChatGptImageMar292026045234Am1} />
        </div>
      </div>
      <Text />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#595959] text-[20px] whitespace-nowrap">
        <p className="leading-[1.3]">Dashboard</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[92px] items-center relative shrink-0">
      <Frame />
      <Text1 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[12.5%_16.67%]" data-name="Group">
      <div className="absolute inset-[-4.17%_-4.69%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5001 19.5">
          <g id="Group">
            <path d={svgPaths.p25ec53a0} id="Vector" stroke="var(--stroke-0, #111827)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p2b4ea840} id="Vector_2" stroke="var(--stroke-0, #111827)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="bg-white overflow-clip relative rounded-[1000px] shrink-0 size-[48px]" data-name="Icon">
      <div className="absolute left-[12px] overflow-clip size-[24px] top-[12px]" data-name="bell">
        <Group />
      </div>
      <div className="absolute left-[27px] size-[8px] top-[14px]" data-name="Skeleton">
        <div className="absolute inset-[-18.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <circle cx="5.5" cy="5.5" fill="var(--fill-0, #FD6A6A)" id="Skeleton" r="4.75" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Icon />
      <div className="flex h-[40px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1186", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-0 relative w-[40px]" data-name="Divider">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 1">
                <line id="Divider" stroke="var(--stroke-0, #EEEFF2)" x2="40" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropDown() {
  return (
    <div className="col-1 h-[4.667px] ml-[114.92px] mt-[9.67px] relative row-1 w-[8.167px]" data-name="Drop Down">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.16669 4.66668">
        <g id="Drop Down">
          <path d={svgPaths.p1ea22380} fill="var(--fill-0, #646464)" id="Shape" />
          <mask height="5" id="mask0_8_927" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="9" x="0" y="0">
            <path d={svgPaths.p1ea22380} fill="var(--fill-0, white)" id="Shape_2" />
          </mask>
          <g mask="url(#mask0_8_927)" />
        </g>
      </svg>
    </div>
  );
}

function Flag() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="Flag">
      <div className="bg-[#d8d8d8] col-1 h-[27px] ml-0 mt-0 relative rounded-[5px] row-1 w-[40px]" data-name="Mask" />
      <div className="col-1 h-[27px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[40px_27px] ml-0 mt-0 relative row-1 w-[40px]" style={{ maskImage: `url('${imgUkFlag}')` }} data-name="UK Flag">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgUkFlag1} />
        </div>
      </div>
    </div>
  );
}

function English() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="English">
      <p className="col-1 font-['Nunito_Sans:SemiBold',sans-serif] font-semibold leading-[normal] ml-[56px] mt-[5px] relative row-1 text-[#646464] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'YTLC' 500, 'wdth' 100" }}>
        English
      </p>
      <DropDown />
      <Flag />
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[48px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="48" src={imgEllipse18} width="48" />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="content-stretch flex flex-col items-start not-italic relative shrink-0 whitespace-nowrap" data-name="Text">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#111827] text-[16px] tracking-[0.3px]">
        <p className="leading-[1.5]">Jack Brown</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#718096] text-[14px]">
        <p className="leading-[1.6]">Admin</p>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="content-stretch flex gap-[10px] items-center leading-[0] relative shrink-0" data-name="Profile">
      <Avatar />
      <Text2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <Frame1 />
      <English />
      <Profile />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[30px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Icon">
          <path d={svgPaths.p24b0c330} id="Vector" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3f0c8f80} id="Vector_2" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2be24f80} id="Vector_3" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p1a14b380} id="Vector_4" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Dashboard1() {
  return (
    <div className="bg-white content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Dashboard">
      <Icon1 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#0a131f] text-[18px] whitespace-nowrap">Dashboard</p>
    </div>
  );
}

function UsersMoreSvgrepoCom() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="users-more-svgrepo-com 1">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="users-more-svgrepo-com 1">
          <path d={svgPaths.p2b9a3f80} id="Vector" stroke="var(--stroke-0, #002213)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Users() {
  return (
    <div className="content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <UsersMoreSvgrepoCom />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#002213] text-[18px] whitespace-nowrap">Bookings</p>
    </div>
  );
}

function IcomoonFreeManWoman() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icomoon-free:man-woman">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icomoon-free:man-woman">
          <path d={svgPaths.p2928b980} id="Vector" stroke="var(--stroke-0, #0A131F)" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Users1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <IcomoonFreeManWoman />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#0a131f] text-[18px] whitespace-nowrap">Clients Management</p>
    </div>
  );
}

function HealthiconsFactoryWorkerOutline() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="healthicons:factory-worker-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="healthicons:factory-worker-outline">
          <path clipRule="evenodd" d={svgPaths.p23405200} fill="var(--fill-0, #0A131F)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Users2() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <HealthiconsFactoryWorkerOutline />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#0a131f] text-[18px] whitespace-nowrap">Artisan Management</p>
    </div>
  );
}

function HealthiconsFactoryWorkerOutline1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="healthicons:factory-worker-outline">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="healthicons:factory-worker-outline">
          <path clipRule="evenodd" d={svgPaths.p23405200} fill="var(--fill-0, #002213)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Users3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <HealthiconsFactoryWorkerOutline1 />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#002213] text-[18px] whitespace-nowrap">Service Management</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[13.33%_10%_11.92%_10%]" data-name="Group">
      <div className="absolute inset-[-5.57%_-5.21%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.2 19.9394">
          <g id="Group">
            <path d={svgPaths.p3ab3fd80} id="Vector" stroke="var(--stroke-0, #002213)" strokeWidth="2" />
            <path d={svgPaths.p28703de0} id="Vector_2" stroke="var(--stroke-0, #002213)" strokeLinecap="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function BitcoinIconsMessageOutline() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="bitcoin-icons:message-outline">
      <Group1 />
    </div>
  );
}

function Users4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <BitcoinIconsMessageOutline />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#002213] text-[18px] whitespace-nowrap">Massage</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.34%_12.51%_8.33%_12.5%]" data-name="Group">
      <div className="absolute inset-[-5%_-5.56%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.999 21.9974">
          <g id="Group">
            <path d={svgPaths.p27053a0} id="Vector" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p17f92900} id="Vector_2" stroke="var(--stroke-0, #0A131F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function HugeiconsSaveMoneyPound() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="hugeicons:save-money-pound">
      <Group2 />
    </div>
  );
}

function Users5() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" data-name="Users">
      <HugeiconsSaveMoneyPound />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#0a131f] text-[18px] whitespace-nowrap">Payment</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[10%_10.83%_10.83%_10%]" data-name="Group">
      <div className="absolute inset-[-5.26%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
          <g id="Group">
            <path d={svgPaths.p3e29ad80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d={svgPaths.p14c43080} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function TablerSettings() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="tabler:settings">
      <Group3 />
    </div>
  );
}

function Users6() {
  return (
    <div className="content-stretch flex gap-[10px] items-center p-[12px] relative rounded-[4px] shrink-0 w-[250px]" style={{ backgroundImage: "linear-gradient(144.926deg, rgb(27, 69, 124) 12.093%, rgb(82, 134, 202) 87.907%)" }} data-name="Users">
      <TablerSettings />
      <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[18px] text-white whitespace-nowrap">Settings</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
      <Dashboard1 />
      <Users />
      <Users1 />
      <Users2 />
      <Users3 />
      <Users4 />
      <Users5 />
      <Users6 />
    </div>
  );
}

function LogOut() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full" data-name="Log Out">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
          <div className="overflow-clip relative shrink-0 size-[30px]" data-name="Icon/Outline/logout">
            <div className="absolute inset-[16.67%_12.5%]" data-name="Icon">
              <div className="absolute inset-[-6.25%_-5.55%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.9981 22.4981">
                  <path d={svgPaths.p249a6800} id="Icon" stroke="var(--stroke-0, #588ACD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.49808" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Poppins:Medium',sans-serif] leading-[32px] not-italic relative shrink-0 text-[#588acd] text-[24px] whitespace-nowrap">Logout</p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[236px] items-start relative shrink-0">
      <Frame4 />
      <LogOut />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] h-[36px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[30px] text-center tracking-[-0.3px] w-[272.73px]">
        <p className="leading-[36px]">Change Password</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] text-center w-[390.78px]">
        <p className="leading-[19.6px]">Ensure your account is using a strong, secure password.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5">
        <g id="Container">
          <path d={svgPaths.pf0742c0} fill="var(--fill-0, #737686)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Container2 />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-[15px] relative size-full">
          <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Enter current password</p>
          </div>
          <Button />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c3c6d7] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function CurrentPassword() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Current Password">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[22px]">Current Password</p>
      </div>
      <Input />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[17px] items-start py-[8px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-[#e1e2ed] h-px relative shrink-0 w-full" data-name="Horizontal Divider" />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5">
        <g id="Container">
          <path d={svgPaths.pf0742c0} fill="var(--fill-0, #737686)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-[15px] relative size-full">
          <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Enter new password</p>
          </div>
          <Button1 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c3c6d7] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[22px]">New Password</p>
      </div>
      <Input1 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[17px] items-start py-[8px] relative shrink-0 w-full" data-name="Margin">
      <div className="bg-[#e1e2ed] h-px relative shrink-0 w-full" data-name="Horizontal Divider" />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[18.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 16.5">
        <g id="Container">
          <path d={svgPaths.pf0742c0} fill="var(--fill-0, #737686)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-[15px] relative size-full">
          <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Enter new password</p>
          </div>
          <Button2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#c3c6d7] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] tracking-[0.14px] whitespace-nowrap">
        <p className="leading-[22px]">Confirm Password</p>
      </div>
      <Input2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[4px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1b457c] flex-[1_0_0] h-[6px] min-w-px relative rounded-[9999px]" data-name="Background" />
      <div className="bg-[#1b457c] flex-[1_0_0] h-[6px] min-w-px relative rounded-[9999px]" data-name="Background" />
      <div className="bg-[#1b457c] flex-[1_0_0] h-[6px] min-w-px relative rounded-[9999px]" data-name="Background" />
      <div className="bg-[#d9d9e5] flex-[1_0_0] h-[6px] min-w-px relative rounded-[9999px]" data-name="Background" />
    </div>
  );
}

function Margin2() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Margin">
      <div className="content-stretch flex flex-col items-start pr-[16px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#1b457c] text-[12px] tracking-[0.6px] uppercase w-[52.98px]">
        <p className="leading-[12px]">STRONG</p>
      </div>
    </div>
  );
}

function StrengthMeter() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[4px] relative shrink-0 w-full" data-name="Strength Meter">
      <Margin2 />
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p39880bc0} fill="var(--fill-0, #004AC6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">At least 8 characters long</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p39880bc0} fill="var(--fill-0, #004AC6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Contains an uppercase letter</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p39880bc0} fill="var(--fill-0, #004AC6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Contains a number</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p2ef93d40} fill="var(--fill-0, #BA1A1A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[11px] items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ba1a1a] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Contains a special character</p>
      </div>
    </div>
  );
}

function Requirements() {
  return (
    <div className="bg-[#faf8ff] relative rounded-[4px] shrink-0 w-full" data-name="Requirements">
      <div className="content-stretch flex flex-col gap-[12px] items-start pb-[12px] pt-[16px] px-[12px] relative size-full">
        <Container7 />
        <Container9 />
        <Container11 />
        <Container13 />
      </div>
    </div>
  );
}

function NewPassword() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="New Password">
      <Frame5 />
      <Margin1 />
      <Frame6 />
      <StrengthMeter />
      <Requirements />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex h-[44px] items-center justify-center p-px relative rounded-[8px] shrink-0 w-[219px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#c3c6d7] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[14px] text-center tracking-[0.14px] w-[50.98px]">
        <p className="leading-[14px]">Cancel</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[9px] relative shrink-0 w-[17.25px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.25 9">
        <g id="Container">
          <path d={svgPaths.p2c1e4420} fill="var(--fill-0, #EEEFFF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[44px] items-center justify-center relative rounded-[8px] shrink-0 w-[217px]" data-name="Button">
      <div aria-hidden="true" className="absolute bg-[#1b457c] inset-0 pointer-events-none rounded-[8px]" />
      <Container15 />
      <div className="flex flex-col font-['Poppins:Medium',sans-serif] h-[14px] justify-center leading-[0] not-italic relative shrink-0 text-[#eeefff] text-[14px] text-center tracking-[0.14px] w-[125.86px]">
        <p className="leading-[14px]">Update Password</p>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_-2px_4px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center pt-[16px] relative shrink-0 w-full" data-name="Actions">
      <Button3 />
      <Button4 />
    </div>
  );
}

function ActionsMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Actions:margin">
      <Actions />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Form">
      <CurrentPassword />
      <Margin />
      <NewPassword />
      <ActionsMargin />
    </div>
  );
}

function ChangePasswordCardLevel1Depth() {
  return (
    <div className="absolute bg-white content-stretch drop-shadow-[0px_4px_10px_rgba(0,0,0,0.1)] flex flex-col gap-[24px] items-start left-[314px] pb-[40px] pt-[24px] px-[24px] rounded-[16px] top-[112px] w-[1102px]" data-name="Change Password Card (Level 1 Depth)">
      <Container />
      <Form />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#f5f5f5] relative size-full" data-name="dashboard">
      <div className="absolute bg-white content-stretch flex h-[96px] items-center justify-between left-0 overflow-clip p-[24px] top-0 w-[1440px]" data-name="Header">
        <Frame3 />
        <Frame2 />
      </div>
      <div className="absolute bg-white content-stretch flex flex-col gap-[40px] items-center left-0 overflow-clip px-[20px] py-[24px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.1)] top-[96px]" data-name="Dashboard Nav">
        <div className="h-[103px] relative shrink-0 w-[250px]" data-name="ChatGPT Image Mar 29, 2026, 04_52_34 AM 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[123.63%] left-[24.55%] max-w-none top-[-6.2%] w-[51.2%]" src={imgChatGptImageMar292026045234Am1} />
          </div>
        </div>
        <Frame7 />
      </div>
      <ChangePasswordCardLevel1Depth />
    </div>
  );
}