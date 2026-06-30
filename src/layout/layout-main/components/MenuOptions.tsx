import { useNavigate } from "@tanstack/react-router";
import { ConfigProvider, Dropdown } from "antd";
import { type JSX } from "react";
import { appSetting } from "../../../constants/app-setting/config.const";
import { useAuth } from "@/context/auth-provider";
import { canAccessRoute } from "@/helpers/access-control.helper";

export function MenuOptions(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentRole = user?.user?.role;
  const color = appSetting?.primaryColor;

  function resolveNavigation(itemLabel: string, to?: string) {
    return { label: itemLabel, to };
  }

  function navigeteTo(to?: string) {
    if (to) navigate({ to });
  }

  function renderLinkLabel(
    label: string,
    to?: string,
    href?: string,
  ): JSX.Element {
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    return <a onClick={() => navigeteTo(to)}>{label}</a>;
  }


  return (
    <div className="flex gap-6 text-neutral-800 dark:text-neutral-400">
      <ConfigProvider
        theme={{
          components: {
            Button: {
              textHoverBg: "transparent"
            },
          },
        }}
      >
        {appSetting.optionsMenu.map((item, index) => {
          const subItems = (item.items ?? [])
            .filter((subItem) => canAccessRoute(currentRole, subItem.to))
            .map((subItem, idx) => {
              const resolved = resolveNavigation(subItem.label, subItem.to);

              return {
                key: `${index}-${idx}`,
                label: renderLinkLabel(resolved.label, resolved.to, subItem.href),
              };
            });

          if (item.label === "Gestão" && currentRole === "ADMIN") {
            subItems.unshift({
              key: `${index}-admin-statement`,
              label: renderLinkLabel("Extratos", "/app/my_area/statement"),
            });

            subItems.unshift({
              key: `${index}-admin-credit`,
              label: renderLinkLabel("Créditos", "/app/my_area/credit"),
            });
          }

          if (subItems.length > 0)
            return (
              <Dropdown
                key={index}
                menu={{ items: subItems }}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
              >
                <a
                  key={index}
                  onClick={() => navigeteTo(item.to)}
                  className="logout-btn cursor-pointer text-[14px] "
                >
                  {item.label}
                </a>
              </Dropdown>
            );

          if (item.href) {
            return (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="logout-btn dark cursor-pointer text-[14px] "
              >
                {item.label}
              </a>
            );
          }

          if (!item.to || !canAccessRoute(currentRole, item.to)) return null;

          const resolved = resolveNavigation(item.label, item.to);

          return (
            <a
              key={index}
              onClick={() => navigeteTo(resolved.to)}
              className="logout-btn dark cursor-pointer text-[14px] "
            >
              {resolved.label}
            </a>
          );
        })}
        <style>
          {`
              .logout-btn:hover  {
                color: ${color} !important;
                font-weight: 500;
              }
                 }
              `}
        </style>
      </ConfigProvider>

    </div>
  );
}
